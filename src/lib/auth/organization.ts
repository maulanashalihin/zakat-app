import type { Kysely } from 'kysely';
import type { Database, User, UserRole, Organization } from '$lib/db';
import type { SessionUser } from '$lib/auth/session';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';

// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  ADMIN: 'admin' as const,
  PETUGAS: 'petugas' as const,
  VIEWER: 'viewer' as const
};

// Type guard to check if user is SessionUser
function isSessionUser(user: User | SessionUser): user is SessionUser {
  return 'globalRole' in user;
}

// Check if user is Super Admin
export function isSuperAdmin(user: User | SessionUser | null): boolean {
  if (!user) return false;
  // SessionUser has globalRole, User from DB has global_role
  const globalRole = isSessionUser(user) ? user.globalRole : user.global_role;
  return globalRole === ROLES.SUPER_ADMIN;
}

// Check if user is Admin (current organization role)
export function isAdmin(user: User | SessionUser | null): boolean {
  if (!user) return false;
  // Only SessionUser has currentRole (per-organization role)
  if (!isSessionUser(user)) return false;
  return user.currentRole === ROLES.ADMIN;
}

// Check if user is Petugas
export function isPetugas(user: User | SessionUser | null): boolean {
  if (!user) return false;
  if (!isSessionUser(user)) return false;
  return user.currentRole === ROLES.PETUGAS;
}

// Check if user is Viewer
export function isViewer(user: User | SessionUser | null): boolean {
  if (!user) return false;
  if (!isSessionUser(user)) return false;
  return user.currentRole === ROLES.VIEWER;
}

// Check if user has specific role
export function hasRole(user: User | SessionUser | null, roles: UserRole | UserRole[]): boolean {
  if (!user) return false;
  const roleList = Array.isArray(roles) ? roles : [roles];
  // Only SessionUser has currentRole for permission checks
  if (!isSessionUser(user)) return false;
  return roleList.includes(user.currentRole as UserRole);
}

// Check if user can access organization
export function canAccessOrganization(user: User | SessionUser | null, orgId: string): boolean {
  if (!user) return false;
  
  // Super admin can access any organization
  if (isSuperAdmin(user)) return true;
  
  // Regular user can access if they have an active membership for this organization
  if (isSessionUser(user) && user.memberships && user.memberships.length > 0) {
    return user.memberships.some(m => m.organizationId === orgId && m.isActive);
  }
  
  // Fallback for backward compatibility
  const userOrgId = isSessionUser(user) ? user.primaryOrganizationId : 
                    user.primary_organization_id;
  return userOrgId === orgId;
}

// Get organization ID from user context
export function getUserOrganizationId(user: User | SessionUser | null): string | null {
  if (!user) return null;
  if (isSuperAdmin(user)) return null; // Super admin doesn't have fixed org
  // Check primaryOrganizationId for SessionUser, primary_organization_id for User
  return isSessionUser(user) ? user.primaryOrganizationId : 
         user.primary_organization_id;
}

// Resolve organization ID from various sources
export async function resolveOrganizationId(
  db: Kysely<Database>,
  user: User | null,
  params?: { orgSlug?: string }
): Promise<string | null> {
  if (!user) return null;
  
  // Super admin with specific org slug
  if (user.global_role === ROLES.SUPER_ADMIN && params?.orgSlug) {
    const org = await db
      .selectFrom('organizations')
      .select('id')
      .where('slug', '=', params.orgSlug)
      .executeTakeFirst();
    return org?.id ?? null;
  }
  
  // Super admin without org slug - return null (needs to select)
  if (user.global_role === ROLES.SUPER_ADMIN) return null;
  
  // Regular user - return their organization
  return user.primary_organization_id;
}

// Require organization access or throw
export function requireOrganizationAccess(
  user: User | null,
  orgId: string
): void {
  if (!canAccessOrganization(user, orgId)) {
    throw error(403, 'Anda tidak memiliki akses ke organisasi ini');
  }
}

// Require specific role
export function requireRole(
  user: User | null,
  roles: UserRole | UserRole[]
): void {
  if (!hasRole(user, roles)) {
    throw error(403, 'Anda tidak memiliki izin untuk mengakses halaman ini');
  }
}

// Get accessible organizations for user
export async function getAccessibleOrganizations(
  db: Kysely<Database>,
  user: User | null
): Promise<Organization[]> {
  if (!user) return [];
  
  if (user.global_role === ROLES.SUPER_ADMIN) {
    return db
      .selectFrom('organizations')
      .selectAll()
      .where('is_active', '=', 1)
      .orderBy('created_at', 'desc')
      .execute();
  }
  
  if (user.primary_organization_id) {
    const org = await db
      .selectFrom('organizations')
      .selectAll()
      .where('id', '=', user.primary_organization_id)
      .executeTakeFirst();
    return org ? [org] : [];
  }
  
  return [];
}

// Check if user needs onboarding
export function needsOnboarding(user: User | SessionUser | null): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return false; // Super admin doesn't need org
  const userOrgId = isSessionUser(user) ? user.primaryOrganizationId : 
                    user.primary_organization_id;
  return !userOrgId;
}

// Organization context for page loads
export interface OrganizationContext {
  organization: Organization;
  user: User;
  sectors: Array<{ id: string; name: string; color: string | null }>;
  settings: {
    default_beras_per_jiwa: number | null;
    default_uang_per_jiwa: number | null;
    active_period_id: string | null;
  } | null;
}

// Load organization context
export async function loadOrganizationContext(
  db: Kysely<Database>,
  user: User | SessionUser,
  orgSlug: string
): Promise<OrganizationContext> {
  // Get organization
  const organization = await db
    .selectFrom('organizations')
    .selectAll()
    .where('slug', '=', orgSlug)
    .executeTakeFirst();

  if (!organization) {
    throw error(404, 'Organisasi yang Anda cari tidak ada');
  }

  // Check access - cast user to User for compatibility
  const userAsUser = user as User;
  requireOrganizationAccess(userAsUser, organization.id);

  // Get sectors
  const sectors = await db
    .selectFrom('sectors')
    .select(['id', 'name', 'color'])
    .where('organization_id', '=', organization.id)
    .where('is_active', '=', 1)
    .execute();

  // Get settings
  const settings = await db
    .selectFrom('app_settings')
    .select(['default_beras_per_jiwa', 'default_uang_per_jiwa', 'active_period_id'])
    .where('organization_id', '=', organization.id)
    .executeTakeFirst();

  return {
    organization,
    user: userAsUser,
    sectors,
    settings: settings ?? null
  };
}

// Permission helpers for specific actions
export const PERMISSIONS = {
  // Organization management
  MANAGE_ORGANIZATIONS: [ROLES.SUPER_ADMIN] as UserRole[],
  
  // User management
  MANAGE_ALL_USERS: [ROLES.SUPER_ADMIN] as UserRole[],
  MANAGE_ORG_USERS: [ROLES.SUPER_ADMIN, ROLES.ADMIN] as UserRole[],
  
  // Master data
  MANAGE_MASTER_DATA: [ROLES.SUPER_ADMIN, ROLES.ADMIN] as UserRole[],
  
  // Muzaki operations
  CREATE_MUZAKI: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PETUGAS] as UserRole[],
  EDIT_ALL_MUZAKI: [ROLES.SUPER_ADMIN, ROLES.ADMIN] as UserRole[],
  EDIT_OWN_MUZAKI: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PETUGAS] as UserRole[],
  
  // Mustahik operations
  CREATE_MUSTAHIK: [ROLES.SUPER_ADMIN, ROLES.ADMIN] as UserRole[],
  EDIT_MUSTAHIK: [ROLES.SUPER_ADMIN, ROLES.ADMIN] as UserRole[],
  
  // Distribution
  MANAGE_DISTRIBUSI: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PETUGAS] as UserRole[],
  
  // View access
  VIEW_DASHBOARD: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PETUGAS, ROLES.VIEWER] as UserRole[],
  VIEW_REPORTS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PETUGAS, ROLES.VIEWER] as UserRole[],
  
  // Export
  EXPORT_DATA: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VIEWER] as UserRole[]
};

// Check if user has permission
export function hasPermission(
  user: User | null,
  permission: UserRole[]
): boolean {
  return hasRole(user, permission);
}
