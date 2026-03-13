import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { organization, user } = await parent();
	const orgId = organization.id;

	// Parse filters
	const sectorId = url.searchParams.get('sector');
	const search = url.searchParams.get('search');

	// ✅ OPTIMIZED: Load sectors on-demand (not in layout)
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', orgId)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();

	// Build query with sector join
	let query = locals.db
		.selectFrom('muzaki')
		.innerJoin('sectors', 'muzaki.sector_id', 'sectors.id')
		.select([
			'muzaki.id',
			'muzaki.name',
			'muzaki.sector_id',
			'muzaki.jumlah_jiwa',
			'muzaki.jenis_zakat',
			'muzaki.jumlah_beras',
			'muzaki.jumlah_uang',
			'muzaki.created_at',
			'muzaki.petugas_id',
			'sectors.name as sector_name'
		])
		.where('muzaki.organization_id', '=', orgId);

	// Petugas restriction - check sector assignment
	if (user.currentRole === 'petugas' && user.currentSectorId) {
		query = query.where('muzaki.sector_id', '=', user.currentSectorId);
	} else if (sectorId) {
		query = query.where('muzaki.sector_id', '=', sectorId);
	}

	// ✅ OPTIMIZED: Use parameterized search with proper escaping
	if (search && search.trim().length > 0) {
		const searchTerm = `%${search.trim()}%`;
		query = query.where('muzaki.name', 'like', searchTerm);
	}

	// ✅ OPTIMIZED: Add limit and order for pagination-ready query
	const muzaki = await query
		.orderBy('muzaki.created_at', 'desc')
		.limit(100)
		.execute();

	return { muzaki, sectors };
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
			.where('organization_id', '=', locals.user?.currentOrganizationId!)
			.executeTakeFirst();

		if (!muzaki) {
			return fail(404, { error: 'Data tidak ditemukan' });
		}

		// Check permission
		if (locals.user?.currentRole !== 'super_admin' && locals.user?.currentRole !== 'admin') {
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
