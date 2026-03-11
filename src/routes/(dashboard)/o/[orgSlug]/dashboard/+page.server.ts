import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// Get counts
	const [muzakiResult, mustahikResult, sectorResult] = await Promise.all([
		locals.db
			.selectFrom('muzaki')
			.select((eb) => eb.fn.count('id').as('count'))
			.where('organization_id', '=', orgId)
			.executeTakeFirst(),
		locals.db
			.selectFrom('mustahik')
			.select((eb) => eb.fn.count('id').as('count'))
			.where('organization_id', '=', orgId)
			.executeTakeFirst(),
		locals.db
			.selectFrom('sectors')
			.select((eb) => eb.fn.count('id').as('count'))
			.where('organization_id', '=', orgId)
			.executeTakeFirst()
	]);

	// Get totals
	const [totalsResult] = await locals.db
		.selectFrom('muzaki')
		.select([
			(eb) => eb.fn.sum('jumlah_jiwa').as('total_jiwa'),
			(eb) => eb.fn.sum('jumlah_beras').as('total_beras'),
			(eb) => eb.fn.sum('jumlah_uang').as('total_uang'),
			(eb) => eb.fn.sum('infaq').as('total_infaq')
		])
		.where('organization_id', '=', orgId)
		.execute();

	return {
		stats: {
			muzakiCount: Number(muzakiResult?.count ?? 0),
			mustahikCount: Number(mustahikResult?.count ?? 0),
			sectorCount: Number(sectorResult?.count ?? 0),
			totalJiwa: Number(totalsResult?.total_jiwa ?? 0),
			totalBeras: Number(totalsResult?.total_beras ?? 0),
			totalUang: Number(totalsResult?.total_uang ?? 0),
			totalInfaq: Number(totalsResult?.total_infaq ?? 0)
		}
	};
};
