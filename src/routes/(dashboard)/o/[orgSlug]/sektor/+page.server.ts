import type { PageServerLoad } from './$types';
import { sql } from 'kysely';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// ✅ OPTIMIZED: Get all sectors first
	const sectors = await locals.db
		.selectFrom('sectors')
		.selectAll()
		.where('organization_id', '=', orgId)
		.orderBy('name', 'asc')
		.execute();

	if (sectors.length === 0) {
		return { sectors: [] };
	}

	const sectorIds = sectors.map(s => s.id);

	// ✅ OPTIMIZED: Get all muzaki stats in ONE query with GROUP BY
	const muzakiStats = await locals.db
		.selectFrom('muzaki')
		.select(['sector_id'])
		.select(({ fn }) => [
			fn.count('id').as('count'),
			sql<number>`cast(jumlah_jiwa as float)`.as('total_jiwa'),
			sql<number>`cast(jumlah_beras as float)`.as('total_beras'),
			sql<number>`cast(jumlah_uang as float)`.as('total_uang')
		])
		.where('organization_id', '=', orgId)
		.where('sector_id', 'in', sectorIds)
		.groupBy('sector_id')
		.execute();

	// ✅ OPTIMIZED: Get all mustahik allocation stats in ONE query with GROUP BY
	// Join mustahik_allocations with mustahik to get sector_id
	const mustahikStats = await locals.db
		.selectFrom('mustahik_allocations')
		.innerJoin('mustahik', 'mustahik_allocations.mustahik_id', 'mustahik.id')
		.select(['mustahik.sector_id'])
		.select(({ fn }) => [
			fn.count('mustahik_allocations.id').as('count'),
			sql<number>`coalesce(sum(cast(mustahik_allocations.alokasi_beras as float)), 0)`.as('total_beras'),
			sql<number>`coalesce(sum(cast(mustahik_allocations.alokasi_uang_lokal as float)), 0)`.as('total_uang')
		])
		.where('mustahik.organization_id', '=', orgId)
		.where('mustahik.sector_id', 'in', sectorIds)
		.groupBy('mustahik.sector_id')
		.execute();

	// ✅ OPTIMIZED: Create lookup maps for O(1) access
	const muzakiStatsMap = new Map(
		muzakiStats.map(s => [s.sector_id, {
			muzakiCount: Number(s.count || 0),
			totalJiwa: Number(s.total_jiwa || 0),
			totalBeras: Number(s.total_beras || 0),
			totalUang: Number(s.total_uang || 0)
		}])
	);

	const mustahikStatsMap = new Map(
		mustahikStats.map(s => [s.sector_id, {
			mustahikCount: Number(s.count || 0),
			mustahikBeras: Number(s.total_beras || 0),
			mustahikUang: Number(s.total_uang || 0)
		}])
	);

	// ✅ OPTIMIZED: Merge data in memory (no more queries!)
	const sectorsWithStats = sectors.map(sector => ({
		...sector,
		muzakiCount: muzakiStatsMap.get(sector.id)?.muzakiCount || 0,
		totalJiwa: muzakiStatsMap.get(sector.id)?.totalJiwa || 0,
		totalBeras: muzakiStatsMap.get(sector.id)?.totalBeras || 0,
		totalUang: muzakiStatsMap.get(sector.id)?.totalUang || 0,
		mustahikCount: mustahikStatsMap.get(sector.id)?.mustahikCount || 0,
		mustahikBeras: mustahikStatsMap.get(sector.id)?.mustahikBeras || 0,
		mustahikUang: mustahikStatsMap.get(sector.id)?.mustahikUang || 0
	}));

	return {
		sectors: sectorsWithStats
	};
};
