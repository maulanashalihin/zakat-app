import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization } = await parent();
	const orgId = organization.id;
	
	// Get muzaki stats
	const muzakiResult = await locals.db
		.selectFrom('muzaki')
		.select(({ fn }) => [
			fn.count('id').as('count'),
			fn.sum('jumlah_jiwa').as('total_jiwa'),
			fn.sum('jumlah_beras').as('total_beras'),
			fn.sum('jumlah_uang').as('total_uang')
		])
		.where('organization_id', '=', orgId)
		.executeTakeFirst();
	
	// Get mustahik count
	const mustahikResult = await locals.db
		.selectFrom('mustahik')
		.select(({ fn }) => fn.count('id').as('count'))
		.where('organization_id', '=', orgId)
		.executeTakeFirst();
	
	// Get sector count
	const sectorResult = await locals.db
		.selectFrom('sectors')
		.select(({ fn }) => fn.count('id').as('count'))
		.where('organization_id', '=', orgId)
		.where('is_active', '=', 1)
		.executeTakeFirst();
	
	// Get recent muzaki (last 5)
	const recentMuzaki = await locals.db
		.selectFrom('muzaki')
		.select(['id', 'name', 'jumlah_jiwa', 'jenis_zakat', 'jumlah_beras', 'jumlah_uang', 'created_at'])
		.where('organization_id', '=', orgId)
		.orderBy('created_at', 'desc')
		.limit(5)
		.execute();
	
	// Calculate totals
	const stats = {
		muzakiCount: Number(muzakiResult?.count || 0),
		mustahikCount: Number(mustahikResult?.count || 0),
		totalJiwa: Number(muzakiResult?.total_jiwa || 0),
		totalBeras: Number(muzakiResult?.total_beras || 0),
		totalUang: Number(muzakiResult?.total_uang || 0),
		sectorCount: Number(sectorResult?.count || 0)
	};
	
	return {
		stats,
		recentMuzaki
	};
};
