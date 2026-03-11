import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();
	
	// Only admin and super_admin can manage petugas
	if (user.role !== 'admin' && user.role !== 'super_admin') {
		throw error(403, 'Tidak memiliki izin mengelola petugas');
	}
	
	// Get all users in this organization
	const users = await locals.db
		.selectFrom('users')
		.select(['id', 'name', 'email', 'role', 'sector_id', 'is_active', 'created_at'])
		.where('organization_id', '=', organization.id)
		.orderBy('created_at', 'desc')
		.execute();
	
	return {
		users
	};
};

export const actions: Actions = {
	create: async ({ request, locals, params }) => {
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
		
		// Get organization
		const organization = await locals.db
			.selectFrom('organizations')
			.select('id')
			.where('slug', '=', params.orgSlug)
			.executeTakeFirst();
		
		if (!organization) {
			return fail(404, { error: 'Organisasi tidak ditemukan' });
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
				password_hash: null, // Will be set on first login via invitation
				provider: 'email',
				role: role as 'admin' | 'petugas' | 'viewer',
				organization_id: organization.id,
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
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		
		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}
		
		// Prevent deleting yourself
		if (id === locals.user?.id) {
			return fail(400, { error: 'Tidak dapat menghapus akun sendiri' });
		}
		
		await locals.db
			.deleteFrom('users')
			.where('id', '=', id)
			.execute();
		
		return { success: true };
	}
};
