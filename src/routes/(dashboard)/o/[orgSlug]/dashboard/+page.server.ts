import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// ✅ OPTIMIZED: Get all stats in single queries using conditional aggregation
	const [muzakiStats, mustahikStats, sectorStats] = await Promise.all([
		// Get muzaki stats
		locals.db
			.selectFrom('muzaki')
			.select(({ fn }) => [
				fn.count('id').as('count'),
				fn.sum('jumlah_jiwa').as('total_jiwa'),
				fn.sum('jumlah_beras').as('total_beras'),
				fn.sum('jumlah_uang').as('total_uang')
			])
			.where('organization_id', '=', orgId)
			.executeTakeFirst(),

		// Get mustahik count
		locals.db
			.selectFrom('mustahik')
			.select(({ fn }) => fn.count('id').as('count'))
			.where('organization_id', '=', orgId)
			.executeTakeFirst(),

		// Get active sector count
		locals.db
			.selectFrom('sectors')
			.select(({ fn }) => fn.count('id').as('count'))
			.where('organization_id', '=', orgId)
			.where('is_active', '=', 1)
			.executeTakeFirst()
	]);

	// ✅ OPTIMIZED: Get recent muzaki with organization name in single query
	const recentMuzaki = await locals.db
		.selectFrom('muzaki')
		.select([
			'id',
			'name',
			'jumlah_jiwa',
			'jenis_zakat',
			'jumlah_beras',
			'jumlah_uang',
			'created_at'
		])
		.where('organization_id', '=', orgId)
		.orderBy('created_at', 'desc')
		.limit(5)
		.execute();

	const stats = {
		muzakiCount: Number(muzakiStats?.count || 0),
		mustahikCount: Number(mustahikStats?.count || 0),
		totalJiwa: Number(muzakiStats?.total_jiwa || 0),
		totalBeras: Number(muzakiStats?.total_beras || 0),
		totalUang: Number(muzakiStats?.total_uang || 0),
		sectorCount: Number(sectorStats?.count || 0)
	};

	return {
		stats,
		recentMuzaki
	};
};
