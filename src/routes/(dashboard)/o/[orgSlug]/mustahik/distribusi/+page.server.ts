import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();
	const orgId = organization.id;

	// Get mustahik that are ready for distribution
	const mustahikList = await locals.db
		.selectFrom('mustahik')
		.leftJoin('sectors', 'mustahik.sector_id', 'sectors.id')
		.leftJoin('mustahik_allocations', 'mustahik.id', 'mustahik_allocations.mustahik_id')
		.select([
			'mustahik.id',
			'mustahik.name',
			'mustahik.address',
			'mustahik.jumlah_jiwa',
			'mustahik.kategori_asnaf',
			'mustahik.kategori_prioritas',
			'mustahik.status_distribusi',
			'sectors.name as sector_name',
			'mustahik_allocations.id as allocation_id',
			'mustahik_allocations.alokasi_beras',
			'mustahik_allocations.alokasi_uang_lokal'
		])
		.where('mustahik.organization_id', '=', orgId)
		.where('mustahik.status_distribusi', '=', 'siap_disalurkan')
		.orderBy('mustahik.kategori_prioritas', 'asc')
		.orderBy('mustahik.created_at', 'desc')
		.limit(100)
		.execute();

	// Get all petugas for this org
	const petugasList = await locals.db
		.selectFrom('users')
		.innerJoin('organization_members', 'users.id', 'organization_members.user_id')
		.select([
			'users.id',
			'users.name',
			'users.email'
		])
		.where('organization_members.organization_id', '=', orgId)
		.where('organization_members.role', 'in', ['admin', 'petugas'])
		.execute();

	return {
		mustahikList,
		petugasList,
		currentUser: user
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const distributionData = formData.get('distribution');

		if (!distributionData) {
			return fail(400, { error: 'Data distribusi tidak valid' });
		}

		const dist = JSON.parse(distributionData.toString());
		const { mustahikId, allocationId, petugasId, beras, uang, catatan } = dist;

		if (!mustahikId || !petugasId) {
			return fail(400, { error: 'Mustahik dan petugas wajib diisi' });
		}

		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		const now = Date.now();

		// Create distribution record
		await locals.db
			.insertInto('distributions')
			.values({
				id: crypto.randomUUID(),
				organization_id: orgId,
				mustahik_id: mustahikId,
				mustahik_allocation_id: allocationId,
				tanggal_distribusi: now,
				petugas_id: petugasId,
				jumlah_beras: parseFloat(beras) || 0,
				jumlah_uang: parseInt(uang) || 0,
				status: 'berhasil',
				catatan: catatan || null,
				created_at: now
			})
			.execute();

		// Update mustahik status
		await locals.db
			.updateTable('mustahik')
			.set({
				status_distribusi: 'sudah_disalurkan' as const,
				tanggal_distribusi: now,
				petugas_penyalur_id: petugasId,
				updated_at: now
			})
			.where('id', '=', mustahikId)
			.execute();

		// Update allocation sudah_diterima
		if (allocationId) {
			await locals.db
				.updateTable('mustahik_allocations')
				.set({
					sudah_diterima: true,
					tanggal_diterima: now
				})
				.where('id', '=', allocationId)
				.execute();
		}

		throw redirect(302, `/o/${params.orgSlug}/mustahik`);
	}
};
