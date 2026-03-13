import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// Parse filters
	const sectorId = url.searchParams.get('sector');
	const search = url.searchParams.get('search');
	const asnafFilter = url.searchParams.get('asnaf');
	const dateFrom = url.searchParams.get('dateFrom');
	const dateTo = url.searchParams.get('dateTo');

	// Build query - join distributions with mustahik and petugas
	let query = locals.db
		.selectFrom('distributions')
		.innerJoin('mustahik', 'distributions.mustahik_id', 'mustahik.id')
		.leftJoin('sectors', 'mustahik.sector_id', 'sectors.id')
		.leftJoin('users as petugas', 'distributions.petugas_id', 'petugas.id')
		.select([
			'distributions.id',
			'distributions.tanggal_distribusi',
			'distributions.jumlah_beras',
			'distributions.jumlah_uang',
			'distributions.bukti_foto_url',
			'distributions.catatan',
			'distributions.created_at',
			'mustahik.id as mustahik_id',
			'mustahik.name as mustahik_name',
			'mustahik.kategori_asnaf',
			'mustahik.jumlah_jiwa',
			'sectors.name as sector_name',
			'petugas.name as petugas_name'
		])
		.where('distributions.organization_id', '=', orgId)
		.orderBy('distributions.tanggal_distribusi', 'desc')
		.limit(200);

	if (sectorId) {
		query = query.where('mustahik.sector_id', '=', sectorId);
	}

	if (asnafFilter) {
		query = query.where('mustahik.kategori_asnaf', '=', asnafFilter);
	}

	if (search && search.trim().length > 0) {
		const searchTerm = `%${search.trim()}%`;
		query = query.where('mustahik.name', 'like', searchTerm);
	}

	if (dateFrom) {
		const fromTimestamp = new Date(dateFrom).getTime();
		query = query.where('distributions.tanggal_distribusi', '>=', fromTimestamp);
	}

	if (dateTo) {
		const toTimestamp = new Date(dateTo).getTime() + 86400000; // End of day
		query = query.where('distributions.tanggal_distribusi', '<=', toTimestamp);
	}

	const distributions = await query.execute();

	// Get sectors for filter
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', orgId)
		.orderBy('name')
		.execute();

	// Calculate summary stats
	const summary = distributions.reduce((acc, d) => {
		acc.totalMustahik++;
		acc.totalBeras += d.jumlah_beras || 0;
		acc.totalUang += d.jumlah_uang || 0;
		
		// By asnaf
		const asnaf = d.kategori_asnaf || 'lainnya';
		if (!acc.byAsnaf[asnaf]) {
			acc.byAsnaf[asnaf] = { count: 0, beras: 0, uang: 0 };
		}
		acc.byAsnaf[asnaf].count++;
		acc.byAsnaf[asnaf].beras += d.jumlah_beras || 0;
		acc.byAsnaf[asnaf].uang += d.jumlah_uang || 0;
		
		return acc;
	}, { 
		totalMustahik: 0, 
		totalBeras: 0, 
		totalUang: 0,
		byAsnaf: {} as Record<string, { count: number; beras: number; uang: number }>
	});

	return { 
		distributions, 
		sectors,
		summary
	};
};
