import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	const { organization, user } = await parent();
	
	const muzaki = await locals.db
		.selectFrom('muzaki')
		.selectAll()
		.where('id', '=', params.id)
		.where('organization_id', '=', organization.id)
		.executeTakeFirst();
	
	if (!muzaki) {
		throw error(404, 'Data muzaki tidak ditemukan');
	}
	
	// Check permission
	if (user.currentRole === 'petugas' && user.sector_id && muzaki.sector_id !== user.sector_id) {
		throw error(403, 'Tidak memiliki akses ke data ini');
	}
	
	return {
		muzaki
	};
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
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
		
		// Update muzaki
		const now = Date.now();
		
		await locals.db
			.updateTable('muzaki')
			.set({
				name: name!,
				address: address || null,
				sector_id: sectorId!,
				jumlah_jiwa: jumlahJiwa,
				jenis_zakat: jenisZakat,
				jumlah_beras: jenisZakat === 'uang' ? 0 : jumlahBeras,
				jumlah_uang: jenisZakat === 'beras' ? 0 : jumlahUang,
				updated_at: now
			})
			.where('id', '=', params.id)
			.execute();
		
		throw redirect(302, `/o/${params.orgSlug}/muzaki`);
	}
};
