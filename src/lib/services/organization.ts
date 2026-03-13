import type { Kysely } from 'kysely';
import type { Database } from '$lib/db';
import { error } from '@sveltejs/kit';

// ============================================================================
// Organization Service
// ============================================================================

export class OrganizationService {
	private db: Kysely<Database>;

	constructor(db: Kysely<Database>) {
		this.db = db;
	}

	// Generate slug from name
	static generateSlug(name: string): string {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	// Check if slug is available
	async isSlugAvailable(slug: string): Promise<boolean> {
		const existing = await this.db
			.selectFrom('organizations')
			.select('id')
			.where('slug', '=', slug)
			.executeTakeFirst();

		return !existing;
	}

	// Create new organization
	async create(data: {
		name: string;
		slug: string;
		address?: string;
		phone?: string;
		email?: string;
	}): Promise<string> {
		const id = crypto.randomUUID();
		const now = Date.now();

		await this.db
			.insertInto('organizations')
			.values({
				id,
				name: data.name,
				slug: data.slug,
				address: data.address || null,
				phone: data.phone || null,
				email: data.email || null,
				logo_url: null,
				is_active: 1,
				created_at: now,
				updated_at: now
			})
			.execute();

		return id;
	}

	// Get organization by user ID
	async getByUserId(userId: string) {
		const membership = await this.db
			.selectFrom('organization_members')
			.innerJoin('organizations', 'organization_members.organization_id', 'organizations.id')
			.select([
				'organizations.id',
				'organizations.name',
				'organizations.slug',
				'organizations.logo_url',
				'organization_members.role',
				'organization_members.sector_id'
			])
			.where('organization_members.user_id', '=', userId)
			.where('organization_members.is_active', '=', 1)
			.orderBy('organization_members.joined_at', 'asc')
			.executeTakeFirst();

		return membership || null;
	}

	// Get all memberships for a user
	async getUserMemberships(userId: string) {
		return await this.db
			.selectFrom('organization_members')
			.innerJoin('organizations', 'organization_members.organization_id', 'organizations.id')
			.select([
				'organization_members.id as membership_id',
				'organization_members.organization_id',
				'organization_members.role',
				'organization_members.sector_id',
				'organization_members.is_active',
				'organizations.name',
				'organizations.slug',
				'organizations.logo_url'
			])
			.where('organization_members.user_id', '=', userId)
			.orderBy('organizations.name', 'asc')
			.execute();
	}

	// Add member to organization
	async addMember(
		userId: string,
		organizationId: string,
		role: 'admin' | 'petugas' | 'viewer' = 'viewer',
		sectorId?: string | null
	) {
		// Check if already a member
		const existing = await this.db
			.selectFrom('organization_members')
			.select('id')
			.where('user_id', '=', userId)
			.where('organization_id', '=', organizationId)
			.executeTakeFirst();

		if (existing) {
			throw error(400, 'User sudah menjadi anggota organisasi ini');
		}

		const id = crypto.randomUUID();
		const now = Date.now();

		await this.db
			.insertInto('organization_members')
			.values({
				id,
				user_id: userId,
				organization_id: organizationId,
				role,
				sector_id: sectorId || null,
				is_active: 1,
				joined_at: now,
				created_at: now,
				updated_at: now
			})
			.execute();

		return { success: true };
	}

	// Update member role
	async updateMemberRole(
		membershipId: string,
		role: 'admin' | 'petugas' | 'viewer'
	) {
		await this.db
			.updateTable('organization_members')
			.set({
				role,
				updated_at: Date.now()
			})
			.where('id', '=', membershipId)
			.execute();

		return { success: true };
	}

	// Remove member from organization
	async removeMember(membershipId: string, userId: string) {
		// Prevent removing yourself
		const membership = await this.db
			.selectFrom('organization_members')
			.select('user_id')
			.where('id', '=', membershipId)
			.executeTakeFirst();

		if (!membership) {
			throw error(404, 'Membership not found');
		}

		if (membership.user_id === userId) {
			throw error(400, 'Tidak dapat menghapus diri sendiri');
		}

		await this.db
			.deleteFrom('organization_members')
			.where('id', '=', membershipId)
			.execute();

		return { success: true };
	}

	// Get all members of an organization
	async getOrganizationMembers(organizationId: string) {
		return await this.db
			.selectFrom('organization_members')
			.innerJoin('users', 'organization_members.user_id', 'users.id')
			.select([
				'organization_members.id as membership_id',
				'organization_members.role',
				'organization_members.sector_id',
				'organization_members.is_active',
				'users.id',
				'users.name',
				'users.email',
				'users.avatar'
			])
			.where('organization_members.organization_id', '=', organizationId)
			.orderBy('organization_members.role', 'asc')
			.execute();
	}
}

// ============================================================================
// Helper Functions (for backward compatibility)
// ============================================================================

export function isSuperAdmin(user: any): boolean {
	return user?.globalRole === 'super_admin';
}

export function hasRole(user: any, roles: string[]): boolean {
	if (!user || !user.currentRole) return false;
	return roles.includes(user.currentRole);
}

export function canAccessOrganization(user: any, organizationId: string): boolean {
	if (!user) return false;
	if (user.globalRole === 'super_admin') return true;
	return user.memberships.some((m: any) => m.organizationId === organizationId && m.isActive);
}

export function needsOnboarding(user: any): boolean {
	if (!user) return false;
	if (user.globalRole === 'super_admin') return false;
	return user.memberships.length === 0;
}
