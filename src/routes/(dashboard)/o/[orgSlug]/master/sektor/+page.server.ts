import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { requireRole } from '$lib/auth/organization';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();

	// Only admin and super admin can manage sectors
	requireRole(user, ['admin', 'super_admin']);

	const sectors = await locals.db
		.selectFrom('sectors')
		.selectAll()
		.where('organization_id', '=', organization.id)
		.orderBy('name')
		.execute();

	return { sectors };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly, not parent()
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.currentRole)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const color = formData.get('color')?.toString() || '#3b82f6';
		const description = formData.get('description')?.toString() || '';

		if (!name || name.length < 2) {
			return fail(400, { error: 'Nama sektor minimal 2 karakter' });
		}

		// ✅ FIXED: Get organization from locals.user.organizationId
		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Check duplicate
		const existing = await locals.db
			.selectFrom('sectors')
			.select('id')
			.where('organization_id', '=', orgId)
			.where('name', '=', name)
			.executeTakeFirst();

		if (existing) {
			return fail(400, { error: 'Nama sektor sudah ada' });
		}

		await locals.db
			.insertInto('sectors')
			.values({
				id: crypto.randomUUID(),
				organization_id: orgId,
				name,
				color,
				description: description || null,
				is_active: 1,
				created_at: Date.now(),
				updated_at: Date.now()
			})
			.execute();

		return { success: true };
	},

	update: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.currentRole)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const color = formData.get('color')?.toString();
		const description = formData.get('description')?.toString();
		const isActive = formData.get('is_active')?.toString() === '1' ? 1 : 0;

		if (!id || !name) {
			return fail(400, { error: 'Data tidak lengkap' });
		}

		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Check ownership
		const sector = await locals.db
			.selectFrom('sectors')
			.select('organization_id')
			.where('id', '=', id)
			.executeTakeFirst();

		if (!sector || sector.organization_id !== orgId) {
			return fail(404, { error: 'Sektor tidak ditemukan' });
		}

		await locals.db
			.updateTable('sectors')
			.set({
				name,
				color,
				description: description || null,
				is_active: isActive,
				updated_at: Date.now()
			})
			.where('id', '=', id)
			.execute();

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.currentRole)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		const orgId = locals.user.currentOrganizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Check ownership
		const sector = await locals.db
			.selectFrom('sectors')
			.select('organization_id')
			.where('id', '=', id)
			.executeTakeFirst();

		if (!sector || sector.organization_id !== orgId) {
			return fail(404, { error: 'Sektor tidak ditemukan' });
		}

		// Check if sector has data
		const [muzakiCount, mustahikCount] = await Promise.all([
			locals.db
				.selectFrom('muzaki')
				.select((eb) => eb.fn.count('id').as('count'))
				.where('sector_id', '=', id)
				.executeTakeFirst(),
			locals.db
				.selectFrom('mustahik')
				.select((eb) => eb.fn.count('id').as('count'))
				.where('sector_id', '=', id)
				.executeTakeFirst()
		]);

		if ((muzakiCount?.count ?? 0) > 0 || (mustahikCount?.count ?? 0) > 0) {
			return fail(400, { error: 'Sektor masih memiliki data. Nonaktifkan saja.' });
		}

		await locals.db
			.deleteFrom('sectors')
			.where('id', '=', id)
			.execute();

		return { success: true };
	}
};
