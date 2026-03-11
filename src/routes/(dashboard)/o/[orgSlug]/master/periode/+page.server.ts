import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();
	
	// Only admin and super_admin can manage periods
	if (user.currentRole !== 'admin' && user.currentRole !== 'super_admin') {
		throw error(403, 'Tidak memiliki izin mengelola periode');
	}
	
	// Get all periods in this organization
	const periods = await locals.db
		.selectFrom('periods')
		.selectAll()
		.where('organization_id', '=', organization.id)
		.orderBy('year_hijri', 'desc')
		.execute();
	
	return {
		periods
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.currentRole)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const yearHijri = parseInt(formData.get('yearHijri')?.toString() || '0');
		const yearMasehi = parseInt(formData.get('yearMasehi')?.toString() || '0');
		const isActive = formData.get('isActive')?.toString() === '1' ? 1 : 0;

		// Validation
		const errors: Record<string, string> = {};

		if (!name) {
			errors.name = 'Nama periode wajib diisi';
		}

		if (!yearHijri || yearHijri < 1400 || yearHijri > 1500) {
			errors.yearHijri = 'Tahun Hijriyah tidak valid (1400-1500)';
		}

		if (!yearMasehi || yearMasehi < 2000 || yearMasehi > 2100) {
			errors.yearMasehi = 'Tahun Masehi tidak valid (2000-2100)';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: Object.fromEntries(formData) });
		}

		// ✅ FIXED: Get organization from locals.user
		const orgId = locals.user.organizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// If setting as active, deactivate other periods
		if (isActive) {
			await locals.db
				.updateTable('periods')
				.set({ is_active: 0 })
				.where('organization_id', '=', orgId)
				.execute();
		}

		// Create period
		const id = crypto.randomUUID();
		const now = Date.now();

		await locals.db
			.insertInto('periods')
			.values({
				id,
				organization_id: orgId,
				name: name!,
				year_hijri: yearHijri,
				year_masehi: yearMasehi,
				is_active: isActive,
				created_at: now
			})
			.execute();

		return { success: true, message: 'Periode berhasil ditambahkan' };
	},

	update: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.currentRole)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();

		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const yearHijri = parseInt(formData.get('yearHijri')?.toString() || '0');
		const yearMasehi = parseInt(formData.get('yearMasehi')?.toString() || '0');
		const isActive = formData.get('isActive')?.toString() === '1' ? 1 : 0;

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		const orgId = locals.user.organizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// If setting as active, deactivate other periods
		if (isActive) {
			await locals.db
				.updateTable('periods')
				.set({ is_active: 0 })
				.where('organization_id', '=', orgId)
				.where('id', '!=', id)
				.execute();
		}

		const now = Date.now();

		await locals.db
			.updateTable('periods')
			.set({
				name: name,
				year_hijri: yearHijri,
				year_masehi: yearMasehi,
				is_active: isActive,
				updated_at: now
			})
			.where('id', '=', id)
			.execute();

		return { success: true, message: 'Periode berhasil diperbarui' };
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

		const orgId = locals.user.organizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Check if period has data
		const muzakiCount = await locals.db
			.selectFrom('muzaki')
			.select((eb) => eb.fn.count('id').as('count'))
			.where('periode_id', '=', id)
			.executeTakeFirst();

		if ((muzakiCount?.count ?? 0) > 0) {
			return fail(400, { error: 'Periode masih memiliki data' });
		}

		await locals.db
			.deleteFrom('periods')
			.where('id', '=', id)
			.execute();

		return { success: true };
	},

	setActive: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.currentRole)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		const orgId = locals.user.organizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Deactivate all other periods
		await locals.db
			.updateTable('periods')
			.set({ is_active: 0 })
			.where('organization_id', '=', orgId)
			.execute();

		// Activate selected period
		const now = Date.now();
		await locals.db
			.updateTable('periods')
			.set({ is_active: 1, updated_at: now })
			.where('id', '=', id)
			.execute();

		return { success: true, message: 'Periode aktif berhasil diubah' };
	}
};
