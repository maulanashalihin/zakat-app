import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { organization, sectors } = await parent();
	return { sectors };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		
		const name = formData.get('name')?.toString().trim();
		const address = formData.get('address')?.toString().trim();
		const sectorId = formData.get('sectorId')?.toString();
		const kategori = formData.get('kategori')?.toString();
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
		
		// Get organization
		const organization = await locals.db
			.selectFrom('organizations')
			.select(['id'])
			.where('slug', '=', params.orgSlug)
			.executeTakeFirst();
		
		if (!organization) {
			return fail(404, { error: 'Organisasi tidak ditemukan' });
		}
		
		// Create mustahik
		const id = crypto.randomUUID();
		const now = Date.now();
		
		await locals.db
			.insertInto('mustahik')
			.values({
				id,
				organization_id: organization.id,
				sector_id: sectorId!,
				name: name!,
				address: address || null,
				kategori: kategori || null,
				jumlah_jiwa: jumlahJiwa,
				status: 'belum',
				keterangan: keterangan || null,
				created_at: now,
				updated_at: now
			})
			.execute();
		
		throw redirect(302, `/o/${params.orgSlug}/mustahik`);
	}
};
