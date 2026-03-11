import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { organization, user } = await parent();
	const orgId = organization.id;

	// Parse filters
	const sectorId = url.searchParams.get('sector');
	const search = url.searchParams.get('search');

	// ✅ OPTIMIZED: Build query with proper indexing
	let query = locals.db
		.selectFrom('muzaki')
		.select([
			'id',
			'name',
			'sector_id',
			'jumlah_jiwa',
			'jenis_zakat',
			'jumlah_beras',
			'jumlah_uang',
			'created_at',
			'petugas_id'
		])
		.where('organization_id', '=', orgId);

	// Petugas restriction - check sector assignment
	if (user.role === 'petugas' && user.sectorId) {
		query = query.where('sector_id', '=', user.sectorId);
	} else if (sectorId) {
		query = query.where('sector_id', '=', sectorId);
	}

	// ✅ OPTIMIZED: Use parameterized search with proper escaping
	if (search && search.trim().length > 0) {
		const searchTerm = `%${search.trim()}%`;
		query = query.where('name', 'like', searchTerm);
	}

	// ✅ OPTIMIZED: Add limit and order for pagination-ready query
	const muzaki = await query
		.orderBy('created_at', 'desc')
		.limit(100) // Increased limit for better UX
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

		// ✅ OPTIMIZED: Single query to verify ownership and permissions
		const muzaki = await locals.db
			.selectFrom('muzaki')
			.select(['id', 'organization_id', 'petugas_id'])
			.where('id', '=', id)
			.where('organization_id', '=', locals.user?.organizationId!)
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
