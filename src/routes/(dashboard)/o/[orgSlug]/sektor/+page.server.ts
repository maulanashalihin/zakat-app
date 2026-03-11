import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, sectors } = await parent();
	const orgId = organization.id;
	
	// Get stats per sector
	const sectorsWithStats = await Promise.all(
		sectors.map(async (sector) => {
			// Get muzaki count and totals for this sector
			const muzakiStats = await locals.db
				.selectFrom('muzaki')
				.select(({ fn }) => [
					fn.count('id').as('count'),
					fn.sum('jumlah_jiwa').as('total_jiwa'),
					fn.sum('jumlah_beras').as('total_beras'),
					fn.sum('jumlah_uang').as('total_uang')
				])
				.where('organization_id', '=', orgId)
				.where('sector_id', '=', sector.id)
				.executeTakeFirst();
			
			// Get mustahik count for this sector
			const mustahikStats = await locals.db
				.selectFrom('mustahik')
				.select(({ fn }) => fn.count('id').as('count'))
				.where('organization_id', '=', orgId)
				.where('sector_id', '=', sector.id)
				.executeTakeFirst();
			
			return {
				...sector,
				muzakiCount: Number(muzakiStats?.count || 0),
				totalJiwa: Number(muzakiStats?.total_jiwa || 0),
				totalBeras: Number(muzakiStats?.total_beras || 0),
				totalUang: Number(muzakiStats?.total_uang || 0),
				mustahikCount: Number(mustahikStats?.count || 0)
			};
		})
	);
	
	return {
		sectors: sectorsWithStats
	};
};
