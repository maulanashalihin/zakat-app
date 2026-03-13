import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();
	const orgId = organization.id;

	// Only admin can manage allocations
	if (user.currentRole !== 'admin' && user.globalRole !== 'super_admin') {
		throw error(403, 'Hanya admin yang dapat mengelola alokasi');
	}

	// Get all mustahik with their current allocations
	const mustahikList = await locals.db
		.selectFrom('mustahik')
		.leftJoin('sectors', 'mustahik.sector_id', 'sectors.id')
		.leftJoin('mustahik_allocations', 'mustahik.id', 'mustahik_allocations.mustahik_id')
		.select([
			'mustahik.id',
			'mustahik.name',
			'mustahik.jumlah_jiwa',
			'mustahik.kategori_asnaf',
			'mustahik.kategori_prioritas',
			'mustahik.status_distribusi',
			'sectors.name as sector_name',
			'mustahik_allocations.alokasi_beras',
			'mustahik_allocations.alokasi_uang_lokal',
			'mustahik_allocations.total_bantuan'
		])
		.where('mustahik.organization_id', '=', orgId)
		.where('mustahik.status_distribusi', '!=', 'sudah_disalurkan')
		.orderBy('mustahik.kategori_prioritas', 'asc')
		.orderBy('mustahik.created_at', 'desc')
		.limit(100)
		.execute();

	// Get app settings for defaults
	const settings = await locals.db
		.selectFrom('app_settings')
		.select(['default_beras_per_jiwa', 'default_uang_per_jiwa'])
		.where('organization_id', '=', orgId)
		.executeTakeFirst();

	return {
		mustahikList,
		defaultBeras: settings?.default_beras_per_jiwa || 2.5,
		defaultUang: settings?.default_uang_per_jiwa || 40000
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const allocations = formData.getAll('allocations[]');

		if (allocations.length === 0) {
			return fail(400, { error: 'Tidak ada data alokasi' });
		}

		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		const now = Date.now();

		// Process each allocation
		for (const allocJson of allocations) {
			const alloc = JSON.parse(allocJson.toString());
			const { mustahikId, beras, uang } = alloc;

			// Check if allocation already exists
			const existing = await locals.db
				.selectFrom('mustahik_allocations')
				.select('id')
				.where('mustahik_id', '=', mustahikId)
				.executeTakeFirst();

			if (existing) {
				// Update existing
				await locals.db
					.updateTable('mustahik_allocations')
					.set({
						alokasi_beras: parseFloat(beras) || 0,
						alokasi_uang_lokal: parseInt(uang) || 0,
						created_at: now
					})
					.where('id', '=', existing.id)
					.execute();
			} else {
				// Create new
				await locals.db
					.insertInto('mustahik_allocations')
					.values({
						id: crypto.randomUUID(),
						mustahik_id: mustahikId,
						alokasi_beras: parseFloat(beras) || 0,
						alokasi_uang_lokal: parseInt(uang) || 0,
						total_bantuan: 0,
						sudah_diterima: false,
						created_at: now
					})
					.execute();
			}

			// Update mustahik status to siap_disalurkan
			await locals.db
				.updateTable('mustahik')
				.set({
					status_distribusi: 'siap_disalurkan' as const,
					updated_at: now
				})
				.where('id', '=', mustahikId)
				.execute();
		}

		throw redirect(302, `/o/${params.orgSlug}/mustahik`);
	}
};
