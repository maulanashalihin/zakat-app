import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { generatePassword, hashPassword } from '$lib/auth/password';
import { sendEmail } from '$lib/email/resend';
import { generatePetugasCredentialsEmail } from '$lib/email/templates/petugas-credentials';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { organization, user } = await parent();

	// Only admin and super_admin can manage petugas
	if (user.currentRole !== 'admin' && user.globalRole !== 'super_admin') {
		throw error(403, 'Tidak memiliki izin mengelola petugas');
	}

	// Query from organization_members joined with users
	const members = await locals.db
		.selectFrom('organization_members')
		.innerJoin('users', 'organization_members.user_id', 'users.id')
		.select([
			'users.id',
			'users.name',
			'users.email',
			'organization_members.role',
			'organization_members.sector_id',
			'organization_members.is_active',
			'organization_members.joined_at',
			'users.avatar'
		])
		.where('organization_members.organization_id', '=', organization.id)
		.orderBy('organization_members.joined_at', 'desc')
		.limit(100)
		.execute();

	// Load sectors for dropdown
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name'])
		.where('organization_id', '=', organization.id)
		.where('is_active', '=', 1)
		.orderBy('name', 'asc')
		.execute();

	return {
		users: members,
		sectors
	};
};

export const actions: Actions = {
	create: async ({ request, locals, params, url }) => {
		if (!locals.user || !(locals.user.currentRole === 'admin' || locals.user.globalRole === 'super_admin')) {
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

		// Get organization from parent or params
		const orgSlug = params.orgSlug;
		const organization = await locals.db
			.selectFrom('organizations')
			.select(['id', 'name'])
			.where('slug', '=', orgSlug)
			.executeTakeFirst();

		if (!organization) {
			return fail(400, { error: 'Organisasi tidak ditemukan' });
		}

		const orgId = organization.id;
		const now = Date.now();

		// Check if email already exists
		const existingUser = await locals.db
			.selectFrom('users')
			.select('id')
			.where('email', '=', email)
			.executeTakeFirst();

		let userId: string;
		let generatedPassword: string | null = null;
		let isNewUser = false;

		if (existingUser) {
			// User exists, check if already member of this org
			const existingMember = await locals.db
				.selectFrom('organization_members')
				.select('id')
				.where('user_id', '=', existingUser.id)
				.where('organization_id', '=', orgId)
				.executeTakeFirst();

			if (existingMember) {
				return fail(400, { error: 'User sudah menjadi anggota organisasi ini', values: Object.fromEntries(formData) });
			}

			userId = existingUser.id;
		} else {
			// Create new user with generated password
			isNewUser = true;
			userId = crypto.randomUUID();
			generatedPassword = generatePassword(12);
			const passwordHash = await hashPassword(generatedPassword);

			await locals.db
				.insertInto('users')
				.values({
					id: userId,
					email: email!,
					name: name!,
					password_hash: passwordHash,
					provider: 'email',
					global_role: 'user',
					primary_organization_id: null,
					sector_id: null,
					is_active: 1,
					email_verified: 0,
					created_at: now,
					updated_at: now
				})
				.execute();
		}

		// Add to organization_members
		const membershipId = crypto.randomUUID();
		await locals.db
			.insertInto('organization_members')
			.values({
				id: membershipId,
				user_id: userId,
				organization_id: orgId,
				role: role as 'admin' | 'petugas' | 'viewer',
				sector_id: sectorId,
				is_active: 1,
				joined_at: now,
				created_at: now,
				updated_at: now
			})
			.execute();

		// Send email with credentials
		let emailSent = false;
		if (isNewUser && generatedPassword) {
			const loginUrl = `${url.origin}/login`;
			const emailTemplate = generatePetugasCredentialsEmail({
				name: name!,
				organizationName: organization.name,
				email: email!,
				password: generatedPassword,
				loginUrl,
				role: role!
			});

			const emailResult = await sendEmail({
				to: email!,
				subject: `Akun ZakatApp Anda - ${organization.name}`,
				html: emailTemplate.html,
				text: emailTemplate.text
			});

			if (emailResult.success) {
				emailSent = true;
			} else {
				console.error('Failed to send credentials email:', emailResult.error);
			}
		}

		return { 
			success: true, 
			message: isNewUser 
				? emailSent 
					? `Petugas berhasil ditambahkan dan email dengan kredensial telah dikirim ke ${email}`
					: `Petugas berhasil ditambahkan. Password: ${generatedPassword} (email gagal dikirim, beritahu petugas secara manual)`
				: 'Petugas berhasil ditambahkan (user sudah ada)',
			generatedPassword: isNewUser ? generatedPassword : null,
			emailSent,
			values: { name, email, role }
		};
	},

	update: async ({ request, locals, params }) => {
		if (!locals.user || !(locals.user.currentRole === 'admin' || locals.user.globalRole === 'super_admin')) {
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

		// Update user name
		await locals.db
			.updateTable('users')
			.set({
				name: name,
				updated_at: now
			})
			.where('id', '=', id)
			.execute();

		// Update membership
		await locals.db
			.updateTable('organization_members')
			.set({
				role: role as 'admin' | 'petugas' | 'viewer',
				sector_id: sectorId,
				is_active: isActive,
				updated_at: now
			})
			.where('user_id', '=', id)
			.execute();

		return { success: true, message: 'Petugas berhasil diperbarui' };
	},

	delete: async ({ request, locals }) => {
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

		// Delete membership (not the user itself)
		await locals.db
			.deleteFrom('organization_members')
			.where('user_id', '=', id)
			.execute();

		return { success: true };
	}
};
