import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// Load sectors
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', orgId)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();

	// Load all mustahik (client will filter)
	const mustahik = await locals.db
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
		.where('mustahik.organization_id', '=', orgId)
		.orderBy('mustahik.created_at', 'desc')
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

	return {
		mustahik,
		stats,
		sectors
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		const mustahik = await locals.db
			.selectFrom('mustahik')
			.select(['id', 'organization_id'])
			.where('id', '=', id)
			.where('organization_id', '=', locals.user?.currentOrganizationId!)
			.executeTakeFirst();

		if (!mustahik) {
			return fail(404, { error: 'Data tidak ditemukan' });
		}

		await locals.db
			.deleteFrom('mustahik')
			.where('id', '=', id)
			.execute();

		return { success: true };
	}
};
