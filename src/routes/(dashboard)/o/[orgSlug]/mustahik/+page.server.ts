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
		.selectFrom('mustahik')
		.selectAll()
		.where('organization_id', '=', orgId);
	
	if (sectorId) {
		query = query.where('sector_id', '=', sectorId);
	}
	
	if (search) {
		query = query.where('name', 'like', `%${search}%`);
	}
	
	const mustahik = await query
		.orderBy('created_at', 'desc')
		.limit(50)
		.execute();
	
	return { mustahik };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		
		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}
		
		// Verify ownership
		const mustahik = await locals.db
			.selectFrom('mustahik')
			.select(['id', 'organization_id'])
			.where('id', '=', id)
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
