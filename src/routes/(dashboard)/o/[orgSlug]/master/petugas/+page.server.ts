import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();

	// Only admin and super_admin can manage petugas
	if (user.role !== 'admin' && user.role !== 'super_admin') {
		throw error(403, 'Tidak memiliki izin mengelola petugas');
	}

	// ✅ OPTIMIZED: Select only needed columns with LIMIT
	const users = await locals.db
		.selectFrom('users')
		.select([
			'id',
			'name',
			'email',
			'role',
			'sector_id',
			'is_active',
			'created_at',
			'avatar'
		])
		.where('organization_id', '=', organization.id)
		.orderBy('created_at', 'desc')
		.limit(100) // Prevent loading too many users
		.execute();

	// ✅ FIXED: Load sectors for dropdown
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', organization.id)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();

	return {
		users,
		sectors
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.role)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const role = formData.get('role')?.toString();
		const sectorId = formData.get('sectorId')?.toString() || null;

		// Validation
		const errors: Record<string, string> = {};

		if (!name) {
			errors.name = 'Nama wajib diisi';
		}

		if (!email) {
			errors.email = 'Email wajib diisi';
		} else if (!email.includes('@')) {
			errors.email = 'Format email tidak valid';
		}

		if (!role || !['admin', 'petugas', 'viewer'].includes(role)) {
			errors.role = 'Peran tidak valid';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: Object.fromEntries(formData) });
		}

		// Check if email already exists
		const existing = await locals.db
			.selectFrom('users')
			.select('id')
			.where('email', '=', email)
			.executeTakeFirst();

		if (existing) {
			return fail(400, { error: 'Email sudah terdaftar', values: Object.fromEntries(formData) });
		}

		// ✅ FIXED: Get organization from locals.user
		const orgId = locals.user.organizationId;
		if (!orgId) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		// Create user
		const id = crypto.randomUUID();
		const now = Date.now();

		await locals.db
			.insertInto('users')
			.values({
				id,
				email: email!,
				name: name!,
				password_hash: null,
				provider: 'email',
				role: role as 'admin' | 'petugas' | 'viewer',
				organization_id: orgId,
				sector_id: sectorId,
				is_active: 1,
				email_verified: 0,
				created_at: now,
				updated_at: now
			})
			.execute();

		return { success: true, message: 'Petugas berhasil ditambahkan. User akan menerima email invitation.' };
	},

	update: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user || !['admin', 'super_admin'].includes(locals.user.role)) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();

		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const role = formData.get('role')?.toString();
		const sectorId = formData.get('sectorId')?.toString() || null;
		const isActive = formData.get('isActive')?.toString() === '1' ? 1 : 0;

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		const now = Date.now();

		await locals.db
			.updateTable('users')
			.set({
				name: name,
				role: role as 'admin' | 'petugas' | 'viewer',
				sector_id: sectorId,
				is_active: isActive,
				updated_at: now
			})
			.where('id', '=', id)
			.execute();

		return { success: true, message: 'Petugas berhasil diperbarui' };
	},

	delete: async ({ request, locals }) => {
		// ✅ FIXED: Use locals.user directly
		if (!locals.user) {
			throw error(403, 'Tidak memiliki izin');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}

		// Prevent deleting yourself
		if (id === locals.user.id) {
			return fail(400, { error: 'Tidak dapat menghapus akun sendiri' });
		}

		await locals.db
			.deleteFrom('users')
			.where('id', '=', id)
			.execute();

		return { success: true };
	}
};
