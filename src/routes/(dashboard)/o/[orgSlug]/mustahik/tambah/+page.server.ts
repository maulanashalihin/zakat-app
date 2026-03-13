import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { organization } = await parent();
	
	// Load sectors directly from database
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', organization.id)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();
	
	return { sectors };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		// ✅ FIXED: Use locals.user.currentOrganizationId directly
		if (!locals.user) {
			throw fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const address = formData.get('address')?.toString().trim();
		const sectorId = formData.get('sectorId')?.toString();
		const kategoriAsnaf = formData.get('kategoriAsnaf')?.toString();
		const kategoriPrioritas = formData.get('kategoriPrioritas')?.toString();
		const jumlahJiwa = parseInt(formData.get('jumlahJiwa')?.toString() || '1');
		const keterangan = formData.get('keterangan')?.toString().trim();

		// Validation
		const errors: Record<string, string> = {};

		if (!name) {
			errors.name = 'Nama wajib diisi';
		}

		if (!sectorId) {
			errors.sectorId = 'Sektor wajib dipilih';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: Object.fromEntries(formData) });
		}

		// ✅ FIXED: Get organization from locals.user
		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Create mustahik
		const id = crypto.randomUUID();
		const now = Date.now();

		await locals.db
			.insertInto('mustahik')
			.values({
				id,
				organization_id: orgId,
				sector_id: sectorId!,
				name: name!,
				address: address || '',
				
				jumlah_jiwa: jumlahJiwa,
				status_distribusi: 'belum_disalurkan' as const,
				kategori_asnaf: (kategoriAsnaf as 'fakir' | 'miskin' | 'amil' | 'mualaf' | 'riqab' | 'gharim' | 'fisabilillah' | 'ibnu_sabil') || null,
				kategori_prioritas: (kategoriPrioritas as 'tinggi' | 'sedang' | 'rendah') || 'sedang',
				catatan_distribusi: keterangan || null,
				created_at: now,
				updated_at: now
			})
			.execute();

		throw redirect(302, `/o/${params.orgSlug}/mustahik`);
	}
};
