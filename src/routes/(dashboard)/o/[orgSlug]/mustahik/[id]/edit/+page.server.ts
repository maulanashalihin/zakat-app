import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, parent }) => {
	const { organization } = await parent();
	
	const mustahik = await locals.db
		.selectFrom('mustahik')
		.selectAll()
		.where('id', '=', params.id)
		.where('organization_id', '=', organization.id)
		.executeTakeFirst();
	
	if (!mustahik) {
		throw error(404, 'Data mustahik tidak ditemukan');
	}
	
	// Load sectors
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', organization.id)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();
	
	return { mustahik, sectors };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		
		const name = formData.get('name')?.toString().trim();
		const address = formData.get('address')?.toString().trim();
		const sectorId = formData.get('sectorId')?.toString();
		const kategoriAsnaf = formData.get('kategoriAsnaf')?.toString();
		const kategoriPrioritas = formData.get('kategoriPrioritas')?.toString();
		const jumlahJiwa = parseInt(formData.get('jumlahJiwa')?.toString() || '1');
		const status = formData.get('status')?.toString();
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
		
		// Update mustahik
		const now = Date.now();
		
		await locals.db
			.updateTable('mustahik')
			.set({
				name: name!,
				address: address || '',
				sector_id: sectorId!,
				
				jumlah_jiwa: jumlahJiwa,
				status_distribusi: (status as 'belum_disalurkan' | 'siap_disalurkan' | 'sudah_disalurkan') || 'belum_disalurkan',
				kategori_asnaf: (kategoriAsnaf as 'fakir' | 'miskin' | 'amil' | 'mualaf' | 'riqab' | 'gharim' | 'fisabilillah' | 'ibnu_sabil') || null,
				kategori_prioritas: (kategoriPrioritas as 'tinggi' | 'sedang' | 'rendah') || 'sedang',
				catatan_distribusi: keterangan || null,
				updated_at: now
			})
			.where('id', '=', params.id)
			.execute();
		
		throw redirect(302, `/o/${params.orgSlug}/mustahik`);
	}
};
