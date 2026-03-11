import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { organization, user } = await parent();
	const orgId = organization.id;
	
	// Parse filters
	const sectorId = url.searchParams.get('sector');
	const search = url.searchParams.get('search');
	
	// Build query
	let query = locals.db
		.selectFrom('muzaki')
		.selectAll()
		.where('organization_id', '=', orgId);
	
	// Petugas restriction
	if (user.role === 'petugas' && user.sectorId) {
		query = query.where('sector_id', '=', user.sectorId);
	} else if (sectorId) {
		query = query.where('sector_id', '=', sectorId);
	}
	
	if (search) {
		query = query.where('name', 'like', `%${search}%`);
	}
	
	const muzaki = await query
		.orderBy('created_at', 'desc')
		.limit(50)
		.execute();
	
	return { muzaki };
};

export const actions: Actions = {
	delete: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		
		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}
		
		// Verify ownership
		const muzaki = await locals.db
			.selectFrom('muzaki')
			.select(['id', 'organization_id', 'petugas_id'])
			.where('id', '=', id)
			.executeTakeFirst();
		
		if (!muzaki) {
			return fail(404, { error: 'Data tidak ditemukan' });
		}
		
		// Check permission
		if (locals.user?.role !== 'super_admin' && locals.user?.role !== 'admin') {
			if (muzaki.petugas_id !== locals.user?.id) {
				return fail(403, { error: 'Tidak memiliki izin' });
			}
		}
		
		await locals.db
			.deleteFrom('muzaki')
			.where('id', '=', id)
			.execute();
		
		return { success: true };
	}
};
