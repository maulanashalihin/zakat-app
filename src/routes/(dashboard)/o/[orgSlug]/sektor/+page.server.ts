import type { PageServerLoad } from './$types';

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
			fn.sum('jumlah_jiwa').as('total_jiwa'),
			fn.sum('jumlah_beras').as('total_beras'),
			fn.sum('jumlah_uang').as('total_uang')
		])
		.where('organization_id', '=', orgId)
		.where('sector_id', 'in', sectorIds)
		.groupBy('sector_id')
		.execute();

	// ✅ OPTIMIZED: Get all mustahik stats in ONE query with GROUP BY
	const mustahikStats = await locals.db
		.selectFrom('mustahik')
		.select(['sector_id'])
		.select(({ fn }) => fn.count('id').as('count'))
		.where('organization_id', '=', orgId)
		.where('sector_id', 'in', sectorIds)
		.groupBy('sector_id')
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
			mustahikCount: Number(s.count || 0)
		}])
	);

	// ✅ OPTIMIZED: Merge data in memory (no more queries!)
	const sectorsWithStats = sectors.map(sector => ({
		...sector,
		...muzakiStatsMap.get(sector.id),
		...mustahikStatsMap.get(sector.id),
		muzakiCount: muzakiStatsMap.get(sector.id)?.muzakiCount || 0,
		totalJiwa: muzakiStatsMap.get(sector.id)?.totalJiwa || 0,
		totalBeras: muzakiStatsMap.get(sector.id)?.totalBeras || 0,
		totalUang: muzakiStatsMap.get(sector.id)?.totalUang || 0,
		mustahikCount: mustahikStatsMap.get(sector.id)?.mustahikCount || 0
	}));

	return {
		sectors: sectorsWithStats
	};
};
