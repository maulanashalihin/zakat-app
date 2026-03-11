import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { organization, sectors, user } = await parent();
	
	// Petugas only sees their assigned sector
	const availableSectors = user.role === 'petugas' && user.sector_id 
		? sectors.filter((s: { id: string }) => s.id === user.sector_id)
		: sectors;
	
	return {
		sectors: availableSectors
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user.organizationId directly
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
		const orgId = locals.user.organizationId;
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
				address: address || null,
				jumlah_jiwa: jumlahJiwa,
				jenis_zakat: jenisZakat,
				jumlah_beras: jenisZakat === 'uang' ? 0 : jumlahBeras,
				jumlah_uang: jenisZakat === 'beras' ? 0 : jumlahUang,
				created_at: now,
				updated_at: now
			})
			.execute();

		throw redirect(302, `/o/${locals.user.organizationId}/muzaki`);
	}
};
