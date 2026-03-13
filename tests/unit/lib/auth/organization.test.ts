import { describe, it, expect } from 'vitest';
import {
  ROLES,
  isSuperAdmin,
  isAdmin,
  isPetugas,
  isViewer,
  hasRole,
  canAccessOrganization,
  getUserOrganizationId,
  needsOnboarding,
  hasPermission,
  PERMISSIONS,
} from '$lib/auth/organization';
import type { User, SessionUser } from '$lib/db';

describe('Organization Auth', () => {
  // Mock users for testing (SessionUser type)
  const superAdminUser = {
    id: '1',
    email: 'super@example.com',
    name: 'Super Admin',
    provider: 'email' as const,
    avatar: null,
    createdAt: Date.now(),
    globalRole: 'super_admin' as const,
    primaryOrganizationId: 'org1',
    memberships: [],
    currentOrganizationId: 'org1',
    currentRole: 'super_admin' as const,
    currentSectorId: null,
  } as SessionUser;

  const adminUser = {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin',
    provider: 'email' as const,
    avatar: null,
    createdAt: Date.now(),
    globalRole: 'user' as const,
    primaryOrganizationId: 'org1',
    memberships: [
      {
        organizationId: 'org1',
        organizationName: 'Org 1',
        organizationSlug: 'org-1',
        organizationLogo: null,
        role: 'admin' as const,
        sectorId: null,
        isActive: true,
      }
    ],
    currentOrganizationId: 'org1',
    currentRole: 'admin' as const,
    currentSectorId: null,
  } as SessionUser;

  const petugasUser = {
    id: '3',
    email: 'petugas@example.com',
    name: 'Petugas',
    provider: 'email' as const,
    avatar: null,
    createdAt: Date.now(),
    globalRole: 'user' as const,
    primaryOrganizationId: 'org1',
    memberships: [
      {
        organizationId: 'org1',
        organizationName: 'Org 1',
        organizationSlug: 'org-1',
        organizationLogo: null,
        role: 'petugas' as const,
        sectorId: null,
        isActive: true,
      }
    ],
    currentOrganizationId: 'org1',
    currentRole: 'petugas' as const,
    currentSectorId: null,
  } as SessionUser;

  const viewerUser = {
    id: '4',
    email: 'viewer@example.com',
    name: 'Viewer',
    provider: 'email' as const,
    avatar: null,
    createdAt: Date.now(),
    globalRole: 'user' as const,
    primaryOrganizationId: 'org1',
    memberships: [
      {
        organizationId: 'org1',
        organizationName: 'Org 1',
        organizationSlug: 'org-1',
        organizationLogo: null,
        role: 'viewer' as const,
        sectorId: null,
        isActive: true,
      }
    ],
    currentOrganizationId: 'org1',
    currentRole: 'viewer' as const,
    currentSectorId: null,
  } as SessionUser;

  const noOrgUser = {
    id: '5',
    email: 'noorg@example.com',
    name: 'No Org',
    provider: 'email' as const,
    avatar: null,
    createdAt: Date.now(),
    globalRole: 'user' as const,
    primaryOrganizationId: null,
    memberships: [],
    currentOrganizationId: null,
    currentRole: null,
    currentSectorId: null,
  } as SessionUser;

  describe('ROLES constants', () => {
    it('should have correct role values', () => {
      expect(ROLES.SUPER_ADMIN).toBe('super_admin');
      expect(ROLES.ADMIN).toBe('admin');
      expect(ROLES.PETUGAS).toBe('petugas');
      expect(ROLES.VIEWER).toBe('viewer');
    });
  });

  describe('isSuperAdmin', () => {
    it('should return true for super admin', () => {
      expect(isSuperAdmin(superAdminUser)).toBe(true);
    });

    it('should return false for non-super admin', () => {
      expect(isSuperAdmin(adminUser)).toBe(false);
      expect(isSuperAdmin(petugasUser)).toBe(false);
      expect(isSuperAdmin(viewerUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(isSuperAdmin(null)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin', () => {
      expect(isAdmin(adminUser)).toBe(true);
    });

    it('should return false for non-admin', () => {
      expect(isAdmin(superAdminUser)).toBe(false);
      expect(isAdmin(petugasUser)).toBe(false);
      expect(isAdmin(viewerUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(isAdmin(null)).toBe(false);
    });
  });

  describe('isPetugas', () => {
    it('should return true for petugas', () => {
      expect(isPetugas(petugasUser)).toBe(true);
    });

    it('should return false for non-petugas', () => {
      expect(isPetugas(superAdminUser)).toBe(false);
      expect(isPetugas(adminUser)).toBe(false);
      expect(isPetugas(viewerUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(isPetugas(null)).toBe(false);
    });
  });

  describe('isViewer', () => {
    it('should return true for viewer', () => {
      expect(isViewer(viewerUser)).toBe(true);
    });

    it('should return false for non-viewer', () => {
      expect(isViewer(superAdminUser)).toBe(false);
      expect(isViewer(adminUser)).toBe(false);
      expect(isViewer(petugasUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(isViewer(null)).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has specified role', () => {
      expect(hasRole(superAdminUser, 'super_admin')).toBe(true);
      expect(hasRole(adminUser, 'admin')).toBe(true);
      expect(hasRole(petugasUser, 'petugas')).toBe(true);
      expect(hasRole(viewerUser, 'viewer')).toBe(true);
    });

    it('should return true when user has one of multiple roles', () => {
      expect(hasRole(adminUser, ['admin', 'super_admin'])).toBe(true);
      expect(hasRole(petugasUser, ['admin', 'petugas'])).toBe(true);
    });

    it('should return false when user does not have specified role', () => {
      expect(hasRole(viewerUser, 'admin')).toBe(false);
      expect(hasRole(petugasUser, ['admin', 'super_admin'])).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasRole(null, 'admin')).toBe(false);
    });
  });

  describe('canAccessOrganization', () => {
    it('should allow super admin to access any organization', () => {
      expect(canAccessOrganization(superAdminUser, 'any-org')).toBe(true);
    });

    it('should allow user to access their assigned organization', () => {
      expect(canAccessOrganization(adminUser, 'org1')).toBe(true);
    });

    it('should deny user access to other organizations', () => {
      expect(canAccessOrganization(adminUser, 'org2')).toBe(false);
    });

    it('should deny access for null user', () => {
      expect(canAccessOrganization(null, 'org1')).toBe(false);
    });

    it('should allow access via memberships (SessionUser)', () => {
      const sessionUserWithMembership = {
        id: '10',
        email: 'member@example.com',
        name: 'Member User',
        provider: 'email' as const,
        avatar: null,
        createdAt: Date.now(),
        globalRole: 'user' as const,
        primaryOrganizationId: 'org1',
        memberships: [
          {
            organizationId: 'org1',
            organizationName: 'Org 1',
            organizationSlug: 'org-1',
            organizationLogo: null,
            role: 'admin' as const,
            sectorId: null,
            isActive: true,
          }
        ],
        currentOrganizationId: 'org1',
        currentRole: 'admin' as const,
        currentSectorId: null,
      } as SessionUser;
      
      expect(canAccessOrganization(sessionUserWithMembership, 'org1')).toBe(true);
      expect(canAccessOrganization(sessionUserWithMembership, 'org2')).toBe(false);
    });

    it('should deny access if membership is not active', () => {
      const sessionUserWithInactiveMembership = {
        id: '11',
        email: 'inactive@example.com',
        name: 'Inactive User',
        provider: 'email' as const,
        avatar: null,
        createdAt: Date.now(),
        globalRole: 'user' as const,
        primaryOrganizationId: 'org1',
        memberships: [
          {
            organizationId: 'org1',
            organizationName: 'Org 1',
            organizationSlug: 'org-1',
            organizationLogo: null,
            role: 'admin' as const,
            sectorId: null,
            isActive: false,
          }
        ],
        currentOrganizationId: 'org1',
        currentRole: 'admin' as const,
        currentSectorId: null,
      } as SessionUser;
      
      expect(canAccessOrganization(sessionUserWithInactiveMembership, 'org1')).toBe(false);
    });

    it('should allow access via primaryOrganizationId fallback', () => {
      const sessionUserWithPrimaryOrg = {
        id: '12',
        email: 'primary@example.com',
        name: 'Primary Org User',
        provider: 'email' as const,
        avatar: null,
        createdAt: Date.now(),
        globalRole: 'user' as const,
        primaryOrganizationId: 'org1',
        memberships: [],
        currentOrganizationId: null,
        currentRole: null,
        currentSectorId: null,
      } as SessionUser;
      
      expect(canAccessOrganization(sessionUserWithPrimaryOrg, 'org1')).toBe(true);
    });
  });

  describe('getUserOrganizationId', () => {
    it('should return null for super admin', () => {
      expect(getUserOrganizationId(superAdminUser)).toBeNull();
    });

    it('should return organization id for regular user', () => {
      expect(getUserOrganizationId(adminUser)).toBe('org1');
    });

    it('should return null for user without organization', () => {
      expect(getUserOrganizationId(noOrgUser)).toBeNull();
    });

    it('should return null for null user', () => {
      expect(getUserOrganizationId(null)).toBeNull();
    });
  });

  describe('needsOnboarding', () => {
    it('should return false for super admin', () => {
      expect(needsOnboarding(superAdminUser)).toBe(false);
    });

    it('should return false for user with organization', () => {
      expect(needsOnboarding(adminUser)).toBe(false);
    });

    it('should return true for user without organization', () => {
      expect(needsOnboarding(noOrgUser)).toBe(true);
    });

    it('should return false for null user', () => {
      expect(needsOnboarding(null)).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has permission', () => {
      expect(hasPermission(superAdminUser, PERMISSIONS.MANAGE_ORGANIZATIONS)).toBe(true);
      expect(hasPermission(adminUser, PERMISSIONS.MANAGE_ORG_USERS)).toBe(true);
      expect(hasPermission(petugasUser, PERMISSIONS.CREATE_MUZAKI)).toBe(true);
      expect(hasPermission(viewerUser, PERMISSIONS.VIEW_DASHBOARD)).toBe(true);
    });

    it('should return false when user does not have permission', () => {
      expect(hasPermission(viewerUser, PERMISSIONS.CREATE_MUZAKI)).toBe(false);
      expect(hasPermission(petugasUser, PERMISSIONS.MANAGE_ORG_USERS)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasPermission(null, PERMISSIONS.VIEW_DASHBOARD)).toBe(false);
    });
  });

  describe('PERMISSIONS', () => {
    it('should have correct permission mappings', () => {
      expect(PERMISSIONS.MANAGE_ORGANIZATIONS).toContain('super_admin');
      expect(PERMISSIONS.MANAGE_ORG_USERS).toContain('admin');
      expect(PERMISSIONS.MANAGE_ORG_USERS).toContain('super_admin');
      expect(PERMISSIONS.CREATE_MUZAKI).toContain('petugas');
      expect(PERMISSIONS.VIEW_DASHBOARD).toContain('viewer');
      expect(PERMISSIONS.VIEW_DASHBOARD).toContain('super_admin');
      expect(PERMISSIONS.VIEW_DASHBOARD).toContain('admin');
      expect(PERMISSIONS.VIEW_DASHBOARD).toContain('petugas');
    });
  });
});
