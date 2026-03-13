import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals, parent }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// Parse filters from URL
	const sectorId = url.searchParams.get('sector');
	const search = url.searchParams.get('search');
	const statusFilter = url.searchParams.get('status');
	const prioritasFilter = url.searchParams.get('prioritas');

	// Build query with filters
	let query = locals.db
		.selectFrom('mustahik')
		.innerJoin('sectors', 'mustahik.sector_id', 'sectors.id')
		.leftJoin('mustahik_allocations', 'mustahik.id', 'mustahik_allocations.mustahik_id')
		.select([
			'mustahik.id',
			'mustahik.name',
			'mustahik.sector_id',
			'mustahik.jumlah_jiwa',
			'mustahik.status_distribusi',
			'mustahik.created_at',
			'mustahik.address',
			'mustahik.pekerjaan',
			'mustahik.tanggungan',
			'mustahik.kategori_asnaf',
			'mustahik.kategori_prioritas',
			'mustahik.catatan_distribusi',
			'sectors.name as sector_name',
			'mustahik_allocations.alokasi_beras',
			'mustahik_allocations.alokasi_uang_lokal'
		])
		.where('mustahik.organization_id', '=', orgId);

	if (sectorId) {
		query = query.where('mustahik.sector_id', '=', sectorId);
	}

	if (statusFilter) {
		query = query.where('mustahik.status_distribusi', '=', statusFilter as 'belum_disalurkan' | 'siap_disalurkan' | 'sudah_disalurkan');
	}

	if (prioritasFilter) {
		query = query.where('mustahik.kategori_prioritas', '=', prioritasFilter as 'tinggi' | 'sedang' | 'rendah');
	}

	if (search && search.trim().length > 0) {
		const searchTerm = `%${search.trim()}%`;
		query = query.where('mustahik.name', 'like', searchTerm);
	}

	const mustahik = await query
		.orderBy('mustahik.created_at', 'desc')
		.limit(100)
		.execute();

	// Calculate stats
	const stats = await locals.db
		.selectFrom('mustahik')
		.select((eb) => [
			eb.fn.count('id').as('total'),
			eb.fn.count(eb.case().when('status_distribusi', '=', 'belum_disalurkan').then(1).end()).as('belum'),
			eb.fn.count(eb.case().when('status_distribusi', '=', 'siap_disalurkan').then(1).end()).as('siap'),
			eb.fn.count(eb.case().when('status_distribusi', '=', 'sudah_disalurkan').then(1).end()).as('sudah')
		])
		.where('organization_id', '=', orgId)
		.executeTakeFirst();

	return json({ mustahik, stats });
};
