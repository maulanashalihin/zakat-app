import { describe, it, expect, vi } from 'vitest';
import { OrganizationService } from '$lib/services/organization';
import type { Database } from '$lib/db';

describe('OrganizationService', () => {
  describe('generateSlug', () => {
    it('should generate slug from name', () => {
      expect(OrganizationService.generateSlug('Test Organization')).toBe('test-organization');
    });

    it('should handle multiple spaces', () => {
      expect(OrganizationService.generateSlug('Test   Organization')).toBe('test-organization');
    });

    it('should handle special characters', () => {
      expect(OrganizationService.generateSlug('Test & Organization!')).toBe('test-organization');
    });

    it('should handle mixed case', () => {
      expect(OrganizationService.generateSlug('TEST ORGANIZATION')).toBe('test-organization');
    });

    it('should handle numbers', () => {
      expect(OrganizationService.generateSlug('Org 123 Test')).toBe('org-123-test');
    });

    it('should trim leading/trailing hyphens', () => {
      expect(OrganizationService.generateSlug('!Test Organization!')).toBe('test-organization');
    });

    it('should handle empty string', () => {
      expect(OrganizationService.generateSlug('')).toBe('');
    });

    it('should handle only special characters', () => {
      expect(OrganizationService.generateSlug('!@#$%')).toBe('');
    });
  });

  describe('isSlugAvailable', () => {
    it('should return true for available slug', async () => {
      const mockDb = {
        selectFrom: vi.fn(() => ({
          select: vi.fn(() => ({
            where: vi.fn(() => ({
              executeTakeFirst: vi.fn().mockResolvedValue(undefined),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.isSlugAvailable('available-slug');

      expect(result).toBe(true);
    });

    it('should return false for taken slug', async () => {
      const mockDb = {
        selectFrom: vi.fn(() => ({
          select: vi.fn(() => ({
            where: vi.fn(() => ({
              executeTakeFirst: vi.fn().mockResolvedValue({ id: 'org-123' }),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.isSlugAvailable('taken-slug');

      expect(result).toBe(false);
    });
  });

  describe('getByUserId', () => {
    it('should return organization membership for user', async () => {
      const mockMembership = {
        id: 'org-123',
        name: 'Test Org',
        slug: 'test-org',
        logo_url: 'https://example.com/logo.png',
        role: 'admin',
        sector_id: null,
      };

      const mockDb = {
        selectFrom: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                where: vi.fn(() => ({
                  orderBy: vi.fn(() => ({
                    executeTakeFirst: vi.fn().mockResolvedValue(mockMembership),
                  })),
                })),
              })),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.getByUserId('user-123');

      expect(result).toEqual(mockMembership);
    });

    it('should return null for user without membership', async () => {
      const mockDb = {
        selectFrom: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                where: vi.fn(() => ({
                  orderBy: vi.fn(() => ({
                    executeTakeFirst: vi.fn().mockResolvedValue(undefined),
                  })),
                })),
              })),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.getByUserId('user-123');

      expect(result).toBeNull();
    });
  });

  describe('getUserMemberships', () => {
    it('should return all memberships for user', async () => {
      const mockMemberships = [
        {
          membership_id: 'mem-1',
          organization_id: 'org-1',
          role: 'admin',
          sector_id: null,
          is_active: 1,
          name: 'Org 1',
          slug: 'org-1',
          logo_url: null,
        },
        {
          membership_id: 'mem-2',
          organization_id: 'org-2',
          role: 'viewer',
          sector_id: 'sec-1',
          is_active: 1,
          name: 'Org 2',
          slug: 'org-2',
          logo_url: null,
        },
      ];

      const mockDb = {
        selectFrom: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                orderBy: vi.fn(() => ({
                  execute: vi.fn().mockResolvedValue(mockMemberships),
                })),
              })),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.getUserMemberships('user-123');

      expect(result).toEqual(mockMemberships);
      expect(result).toHaveLength(2);
    });

    it('should return empty array for user without memberships', async () => {
      const mockDb = {
        selectFrom: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                orderBy: vi.fn(() => ({
                  execute: vi.fn().mockResolvedValue([]),
                })),
              })),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.getUserMemberships('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('addMember', () => {
    it('should add member to organization', async () => {
      const mockDb = {
        selectFrom: vi.fn(() => ({
          select: vi.fn(() => ({
            where: vi.fn(() => ({
              where: vi.fn(() => ({
                executeTakeFirst: vi.fn().mockResolvedValue(undefined),
              })),
            })),
          })),
        })),
        insertInto: vi.fn(() => ({
          values: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({ insertId: 'mem-123' }),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.addMember('user-123', 'org-123', 'petugas', 'sec-1');

      expect(result.success).toBe(true);
    });

    it('should throw error if user is already a member', async () => {
      const mockDb = {
        selectFrom: vi.fn(() => ({
          select: vi.fn(() => ({
            where: vi.fn(() => ({
              where: vi.fn(() => ({
                executeTakeFirst: vi.fn().mockResolvedValue({ id: 'mem-123' }),
              })),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);

      await expect(service.addMember('user-123', 'org-123')).rejects.toThrow();
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      const mockDb = {
        updateTable: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn(() => ({
              execute: vi.fn().mockResolvedValue({ affectedRows: 1 }),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.updateMemberRole('mem-123', 'admin');

      expect(result.success).toBe(true);
    });
  });

  describe('getOrganizationMembers', () => {
    it('should return all members of organization', async () => {
      const mockMembers = [
        {
          membership_id: 'mem-1',
          role: 'admin',
          sector_id: null,
          is_active: 1,
          id: 'user-1',
          name: 'Admin User',
          email: 'admin@example.com',
          avatar: null,
        },
        {
          membership_id: 'mem-2',
          role: 'petugas',
          sector_id: 'sec-1',
          is_active: 1,
          id: 'user-2',
          name: 'Petugas User',
          email: 'petugas@example.com',
          avatar: null,
        },
      ];

      const mockDb = {
        selectFrom: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                orderBy: vi.fn(() => ({
                  execute: vi.fn().mockResolvedValue(mockMembers),
                })),
              })),
            })),
          })),
        })),
      } as unknown as Kysely<Database>;

      const service = new OrganizationService(mockDb);
      const result = await service.getOrganizationMembers('org-123');

      expect(result).toEqual(mockMembers);
      expect(result).toHaveLength(2);
    });
  });
});
