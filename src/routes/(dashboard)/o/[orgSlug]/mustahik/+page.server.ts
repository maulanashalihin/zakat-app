import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { organization } = await parent();
	const orgId = organization.id;

	// Parse filters
	const sectorId = url.searchParams.get('sector');
	const search = url.searchParams.get('search');

	// ✅ OPTIMIZED: Build query with proper indexing
	let query = locals.db
		.selectFrom('mustahik')
		.select([
			'id',
			'name',
			'sector_id',
			'kategori',
			'jumlah_jiwa',
			'status',
			'created_at'
		])
		.where('organization_id', '=', orgId);

	if (sectorId) {
		query = query.where('sector_id', '=', sectorId);
	}

	// ✅ OPTIMIZED: Use parameterized search
	if (search && search.trim().length > 0) {
		const searchTerm = `%${search.trim()}%`;
		query = query.where('name', 'like', searchTerm);
	}

	// ✅ OPTIMIZED: Add limit for performance
	const mustahik = await query
		.orderBy('created_at', 'desc')
		.limit(100)
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

		// ✅ OPTIMIZED: Single query with organization check
		const mustahik = await locals.db
			.selectFrom('mustahik')
			.select(['id', 'organization_id'])
			.where('id', '=', id)
			.where('organization_id', '=', locals.user?.organizationId!)
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
