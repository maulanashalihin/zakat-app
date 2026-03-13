import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { organization, user } = await parent();
	
	// Load sectors directly from database
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', organization.id)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();
	
	// Petugas only sees their assigned sector
	const availableSectors = user.currentRole === 'petugas' && user.currentSectorId 
		? sectors.filter((s) => s.id === user.currentSectorId)
		: sectors;
	
	return {
		sectors: availableSectors
	};
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
		const jumlahJiwa = parseInt(formData.get('jumlahJiwa')?.toString() || '1');
		const jenisZakat = formData.get('jenisZakat')?.toString() || 'uang';
		const jumlahBeras = parseFloat(formData.get('jumlahBeras')?.toString() || '0');
		const jumlahUang = parseInt(formData.get('jumlahUang')?.toString() || '0');

		// Validation
		const errors: Record<string, string> = {};

		if (!name) {
			errors.name = 'Nama wajib diisi';
		}

		if (!sectorId) {
			errors.sectorId = 'Sektor wajib dipilih';
		}

		if (jumlahJiwa < 1) {
			errors.jumlahJiwa = 'Jumlah jiwa minimal 1';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: Object.fromEntries(formData) });
		}

		// ✅ FIXED: Get organization from locals.user
		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Create muzaki
		const id = crypto.randomUUID();
		const now = Date.now();

		await locals.db
			.insertInto('muzaki')
			.values({
				id,
				organization_id: orgId,
				sector_id: sectorId!,
				petugas_id: locals.user.id,
				name: name!,
				address: address || '',
				jumlah_jiwa: jumlahJiwa,
				jenis_zakat: jenisZakat as 'beras' | 'uang' | 'keduanya',
				jumlah_beras: jenisZakat === 'uang' ? 0 : jumlahBeras,
				jumlah_uang: jenisZakat === 'beras' ? 0 : jumlahUang,
				created_at: now,
				updated_at: now
			})
			.execute();

		throw redirect(302, `/o/${params.orgSlug}/muzaki`);
	}
};
