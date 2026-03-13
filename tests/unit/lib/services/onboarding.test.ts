import { describe, it, expect, vi } from 'vitest';
import { OnboardingService } from '$lib/services/onboarding';
import type { Database, OnboardingSession } from '$lib/db';

// Mock Kysely db
const createMockDb = () => {
  const sessions: Map<string, OnboardingSession> = new Map();
  const organizations: Map<string, any> = new Map();
  const settings: Map<string, any> = new Map();
  const periods: Map<string, any> = new Map();
  const sectors: Map<string, any> = new Map();
  const users: Map<string, any> = new Map();
  const members: Map<string, any> = new Map();

  return {
    sessions,
    organizations,
    settings,
    periods,
    sectors,
    users,
    members,
    
    selectFrom: vi.fn((table: string) => ({
      selectAll: vi.fn(() => ({
        where: vi.fn((col: string, op: string, value: any) => ({
          executeTakeFirst: async () => {
            if (table === 'onboarding_sessions') {
              for (const session of sessions.values()) {
                if (session.user_id === value) return session;
              }
            }
            return undefined;
          },
          execute: async () => {
            const results: any[] = [];
            if (table === 'onboarding_sessions') {
              for (const session of sessions.values()) {
                if (session.user_id === value) results.push(session);
              }
            }
            return results;
          },
        })),
        executeTakeFirst: async () => undefined,
      })),
      select: vi.fn((cols: string[]) => ({
        where: vi.fn(() => ({
          executeTakeFirst: async () => undefined,
        })),
      })),
    })),
    
    insertInto: vi.fn((table: string) => ({
      values: vi.fn((data: any) => ({
        execute: async () => {
          if (table === 'onboarding_sessions') {
            sessions.set(data.id, { ...data, is_completed: data.is_completed === 1 } as OnboardingSession);
          } else if (table === 'organizations') {
            organizations.set(data.id, data);
          } else if (table === 'app_settings') {
            settings.set(data.id, data);
          } else if (table === 'periods') {
            periods.set(data.id, data);
          } else if (table === 'sectors') {
            sectors.set(data.id, data);
          } else if (table === 'users') {
            users.set(data.id, data);
          } else if (table === 'organization_members') {
            members.set(data.id, data);
          }
          return { insertId: data.id };
        },
      })),
    })),
    
    updateTable: vi.fn((table: string) => ({
      set: vi.fn((data: any) => ({
        where: vi.fn((col: string, op: string, value: any) => ({
          execute: async () => {
            if (table === 'onboarding_sessions') {
              for (const [id, session] of sessions) {
                if (session.user_id === value) {
                  sessions.set(id, { ...session, ...data });
                }
              }
            } else if (table === 'users') {
              const user = users.get(value);
              if (user) users.set(value, { ...user, ...data });
            } else if (table === 'app_settings') {
              for (const [id, setting] of settings) {
                if (setting.organization_id === value) {
                  settings.set(id, { ...setting, ...data });
                }
              }
            }
            return { affectedRows: 1 };
          },
        })),
      })),
    })),
  } as unknown as Kysely<Database>;
};

describe('OnboardingService', () => {
  describe('createSession', () => {
    it('should create a new onboarding session', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      const sessionId = await service.createSession(userId);

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(db.sessions.has(sessionId)).toBe(true);
      
      const session = db.sessions.get(sessionId);
      expect(session?.user_id).toBe(userId);
      expect(session?.current_step).toBe(1);
      expect(session?.is_completed === 0 || session?.is_completed === false).toBe(true);
    });

    it('should return existing session if one exists', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      const sessionId1 = await service.createSession(userId);
      const sessionId2 = await service.createSession(userId);

      expect(sessionId1).toBe(sessionId2);
      expect(db.sessions.size).toBe(1);
    });
  });

  describe('getSession', () => {
    it('should return session for user', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      await service.createSession(userId);
      const session = await service.getSession(userId);

      expect(session).toBeDefined();
      expect(session?.user_id).toBe(userId);
    });

    it('should return undefined for non-existent session', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);

      const session = await service.getSession('non-existent');

      expect(session).toBeUndefined();
    });
  });

  describe('saveStep1', () => {
    it('should save step 1 data', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      await service.createSession(userId);
      
      const step1Data = {
        name: 'Test Organization',
        slug: 'test-org',
        address: 'Test Address',
        phone: '1234567890',
        email: 'test@example.com',
      };

      await service.saveStep1(userId, step1Data);
      
      const tempData = await service.getTempData(userId);
      expect(tempData.step1).toEqual(step1Data);
    });
  });

  describe('saveStep2', () => {
    it('should save step 2 data', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      await service.createSession(userId);
      
      const step2Data = {
        defaultBerasPerJiwa: 2.5,
        defaultUangPerJiwa: 40000,
        yearHijri: 1446,
        yearMasehi: 2025,
        periodName: 'Ramadan 1446H',
      };

      await service.saveStep2(userId, step2Data);
      
      const tempData = await service.getTempData(userId);
      expect(tempData.step2).toEqual(step2Data);
    });
  });

  describe('saveStep3', () => {
    it('should save step 3 data', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      await service.createSession(userId);
      
      const step3Data = {
        sectors: [
          { name: 'Sector 1', color: '#3b82f6' },
          { name: 'Sector 2', color: '#ef4444' },
        ],
      };

      await service.saveStep3(userId, step3Data);
      
      const tempData = await service.getTempData(userId);
      expect(tempData.step3).toEqual(step3Data);
    });
  });

  describe('getCurrentStep', () => {
    it('should return current step', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      await service.createSession(userId);
      const step = await service.getCurrentStep(userId);

      expect(step).toBe(1);
    });

    it('should return 1 for non-existent session', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);

      const step = await service.getCurrentStep('non-existent');

      expect(step).toBe(1);
    });
  });

  describe('isCompleted', () => {
    it('should return false for incomplete onboarding', async () => {
      const db = createMockDb();
      const service = new OnboardingService(db);
      const userId = 'user-123';

      await service.createSession(userId);
      const completed = await service.isCompleted(userId);

      expect(completed).toBe(false);
    });
  });

  describe('validateStep1', () => {
    it('should return null for valid data', () => {
      const validData = {
        name: 'Test Organization',
        slug: 'test-org',
      };

      const result = OnboardingService.validateStep1(validData);
      expect(result).toBeNull();
    });

    it('should return error for short name', () => {
      const invalidData = {
        name: 'Te',
        slug: 'test',
      };

      const result = OnboardingService.validateStep1(invalidData);
      expect(result).toBe('Nama organisasi minimal 3 karakter');
    });

    it('should return error for invalid slug', () => {
      const invalidData = {
        name: 'Test',
        slug: 'Test_Org',
      };

      const result = OnboardingService.validateStep1(invalidData);
      expect(result).toBe('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung');
    });

    it('should return error for short slug', () => {
      const invalidData = {
        name: 'Test',
        slug: 'te',
      };

      const result = OnboardingService.validateStep1(invalidData);
      expect(result).toBe('Slug tidak valid');
    });
  });

  describe('validateStep2', () => {
    it('should return null for valid data', () => {
      const validData = {
        defaultBerasPerJiwa: 2.5,
        defaultUangPerJiwa: 40000,
        yearHijri: 1446,
        yearMasehi: 2025,
        periodName: 'Ramadan 1446H',
      };

      const result = OnboardingService.validateStep2(validData);
      expect(result).toBeNull();
    });

    it('should return error for invalid beras per jiwa', () => {
      const invalidData = {
        defaultBerasPerJiwa: 0,
        defaultUangPerJiwa: 40000,
        yearHijri: 1446,
        yearMasehi: 2025,
        periodName: 'Test',
      };

      const result = OnboardingService.validateStep2(invalidData);
      expect(result).toBe('Beras per jiwa harus lebih dari 0');
    });

    it('should return error for invalid year hijri', () => {
      const invalidData = {
        defaultBerasPerJiwa: 2.5,
        defaultUangPerJiwa: 40000,
        yearHijri: 1000,
        yearMasehi: 2025,
        periodName: 'Test',
      };

      const result = OnboardingService.validateStep2(invalidData);
      expect(result).toBe('Tahun Hijriyah tidak valid');
    });

    it('should return error for invalid year masehi', () => {
      const invalidData = {
        defaultBerasPerJiwa: 2.5,
        defaultUangPerJiwa: 40000,
        yearHijri: 1446,
        yearMasehi: 1999,
        periodName: 'Test',
      };

      const result = OnboardingService.validateStep2(invalidData);
      expect(result).toBe('Tahun Masehi tidak valid');
    });
  });

  describe('validateStep3', () => {
    it('should return null for valid data', () => {
      const validData = {
        sectors: [{ name: 'Sector 1' }],
      };

      const result = OnboardingService.validateStep3(validData);
      expect(result).toBeNull();
    });

    it('should return error for empty sectors', () => {
      const invalidData = {
        sectors: [],
      };

      const result = OnboardingService.validateStep3(invalidData);
      expect(result).toBe('Minimal 1 sektor diperlukan');
    });

    it('should return error for sector with short name', () => {
      const invalidData = {
        sectors: [{ name: 'S' }],
      };

      const result = OnboardingService.validateStep3(invalidData);
      expect(result).toBe('Nama sektor minimal 2 karakter');
    });
  });
});
