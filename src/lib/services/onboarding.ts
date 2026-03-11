import type { Kysely } from 'kysely';
import type { Database, OnboardingSession, NewOnboardingSession, Organization, NewOrganization, NewSector, NewPeriod, NewUser, NewAppSetting } from '$lib/db';

export interface OnboardingStep1Data {
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface OnboardingStep2Data {
  defaultBerasPerJiwa: number;
  defaultUangPerJiwa: number;
  yearHijri: number;
  yearMasehi: number;
  periodName: string;
}

export interface OnboardingStep3Data {
  sectors: Array<{
    name: string;
    color?: string;
  }>;
}

export interface OnboardingStep4Data {
  skip: boolean;
  members?: Array<{
    name: string;
    email: string;
    role: 'petugas' | 'viewer';
    sectorId?: string;
  }>;
}

export interface OnboardingTempData {
  step1?: OnboardingStep1Data;
  step2?: OnboardingStep2Data;
  step3?: OnboardingStep3Data;
  step4?: OnboardingStep4Data;
}

export class OnboardingService {
  constructor(private db: Kysely<Database>) {}

  async createSession(userId: string): Promise<string> {
    // Check if session exists
    const existing = await this.getSession(userId);
    if (existing) {
      return existing.id;
    }

    const id = crypto.randomUUID();
    const now = Date.now();
    
    await this.db
      .insertInto('onboarding_sessions')
      .values({
        id,
        user_id: userId,
        current_step: 1,
        completed_steps: '[]',
        is_completed: 0,
        started_at: now,
        expires_at: now + (7 * 24 * 60 * 60 * 1000) // 7 days
      })
      .execute();
    
    return id;
  }

  async getSession(userId: string): Promise<OnboardingSession | undefined> {
    return this.db
      .selectFrom('onboarding_sessions')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst();
  }

  async getTempData(userId: string): Promise<OnboardingTempData> {
    const session = await this.getSession(userId);
    if (!session?.temp_data) return {};
    
    try {
      return JSON.parse(session.temp_data);
    } catch {
      return {};
    }
  }

  private async updateTempData(userId: string, data: Partial<OnboardingTempData>): Promise<void> {
    const existing = await this.getTempData(userId);
    const merged = { ...existing, ...data };
    
    await this.db
      .updateTable('onboarding_sessions')
      .set({ temp_data: JSON.stringify(merged) })
      .where('user_id', '=', userId)
      .execute();
  }

  async saveStep1(userId: string, data: OnboardingStep1Data): Promise<void> {
    await this.updateTempData(userId, { step1: data });
    await this.markStepCompleted(userId, 1);
  }

  async saveStep2(userId: string, data: OnboardingStep2Data): Promise<void> {
    await this.updateTempData(userId, { step2: data });
    await this.markStepCompleted(userId, 2);
  }

  async saveStep3(userId: string, data: OnboardingStep3Data): Promise<void> {
    await this.updateTempData(userId, { step3: data });
    await this.markStepCompleted(userId, 3);
  }

  async saveStep4(userId: string, data: OnboardingStep4Data): Promise<void> {
    await this.updateTempData(userId, { step4: data });
    await this.markStepCompleted(userId, 4);
  }

  private async markStepCompleted(userId: string, step: number): Promise<void> {
    const session = await this.getSession(userId);
    if (!session) return;

    const completed = JSON.parse(session.completed_steps || '[]') as number[];
    if (!completed.includes(step)) {
      completed.push(step);
    }

    await this.db
      .updateTable('onboarding_sessions')
      .set({
        current_step: step + 1,
        completed_steps: JSON.stringify(completed)
      })
      .where('user_id', '=', userId)
      .execute();
  }

  async completeOnboarding(userId: string): Promise<{ organizationId: string; slug: string }> {
    const tempData = await this.getTempData(userId);
    const now = Date.now();

    if (!tempData.step1 || !tempData.step2 || !tempData.step3) {
      throw new Error('Data onboarding tidak lengkap');
    }

    // 1. Create organization
    const orgId = crypto.randomUUID();
    await this.db
      .insertInto('organizations')
      .values({
        id: orgId,
        name: tempData.step1.name,
        slug: tempData.step1.slug,
        address: tempData.step1.address || null,
        phone: tempData.step1.phone || null,
        email: tempData.step1.email || null,
        logo_url: tempData.step1.logoUrl || null,
        is_active: 1,
        created_at: now,
        updated_at: now
      })
      .execute();

    // 2. Create settings
    await this.db
      .insertInto('app_settings')
      .values({
        id: crypto.randomUUID(),
        organization_id: orgId,
        default_beras_per_jiwa: tempData.step2.defaultBerasPerJiwa,
        default_uang_per_jiwa: tempData.step2.defaultUangPerJiwa,
        updated_at: now
      })
      .execute();

    // 3. Create period
    const periodId = crypto.randomUUID();
    await this.db
      .insertInto('periods')
      .values({
        id: periodId,
        organization_id: orgId,
        year_hijri: tempData.step2.yearHijri,
        year_masehi: tempData.step2.yearMasehi,
        name: tempData.step2.periodName,
        is_active: 1,
        created_at: now
      })
      .execute();

    // Update settings with active period
    await this.db
      .updateTable('app_settings')
      .set({ active_period_id: periodId })
      .where('organization_id', '=', orgId)
      .execute();

    // 4. Create sectors
    const sectorIds: Record<string, string> = {};
    for (const sector of tempData.step3.sectors) {
      const sectorId = crypto.randomUUID();
      sectorIds[sector.name] = sectorId;

      await this.db
        .insertInto('sectors')
        .values({
          id: sectorId,
          organization_id: orgId,
          name: sector.name,
          color: sector.color || '#3b82f6',
          is_active: 1,
          created_at: now,
          updated_at: now
        })
        .execute();
    }

    // 5. ⭐ NEW: Add user as admin member of this organization
    const membershipId = crypto.randomUUID();
    await this.db
      .insertInto('organization_members')
      .values({
        id: membershipId,
        user_id: userId,
        organization_id: orgId,
        role: 'admin',
        sector_id: null,
        is_active: 1,
        joined_at: now,
        created_at: now,
        updated_at: now
      })
      .execute();

    // 6. Update user's primary organization
    await this.db
      .updateTable('users')
      .set({
        primary_organization_id: orgId,
        updated_at: now
      })
      .where('id', '=', userId)
      .execute();

    // 7. Invite team members (if any)
    if (tempData.step4?.members && tempData.step4.members.length > 0) {
      for (const member of tempData.step4.members) {
        // Check if user exists
        let existingMember = await this.db
          .selectFrom('users')
          .select('id')
          .where('email', '=', member.email)
          .executeTakeFirst();

        let memberId = existingMember?.id;

        if (!existingMember) {
          // Create new user
          memberId = crypto.randomUUID();
          await this.db
            .insertInto('users')
            .values({
              id: memberId,
              email: member.email,
              name: member.name,
              password_hash: null,
              provider: 'email',
              global_role: 'user',
              primary_organization_id: null,
              sector_id: null,
              is_active: 1,
              created_at: now,
              updated_at: now
            })
            .execute();
        }

        // Add as member
        const memberMembershipId = crypto.randomUUID();
        await this.db
          .insertInto('organization_members')
          .values({
            id: memberMembershipId,
            user_id: memberId!,
            organization_id: orgId,
            role: member.role,
            sector_id: member.sectorId || null,
            is_active: 1,
            joined_at: now,
            created_at: now,
            updated_at: now
          })
          .execute();

        // TODO: Send invitation email
      }
    }

    // 8. Mark onboarding as completed
    await this.db
      .updateTable('onboarding_sessions')
      .set({
        is_completed: 1,
        completed_at: now,
        created_organization_id: orgId
      })
      .where('user_id', '=', userId)
      .execute();

    return { organizationId: orgId, slug: tempData.step1.slug };
  }

  async getCurrentStep(userId: string): Promise<number> {
    const session = await this.getSession(userId);
    return session?.current_step ?? 1;
  }

  async isCompleted(userId: string): Promise<boolean> {
    const session = await this.getSession(userId);
    return session?.is_completed === 1;
  }

  // Validation helpers
  static validateStep1(data: OnboardingStep1Data): string | null {
    if (!data.name || data.name.length < 3) {
      return 'Nama organisasi minimal 3 karakter';
    }
    if (!data.slug || data.slug.length < 3) {
      return 'Slug tidak valid';
    }
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      return 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung';
    }
    return null;
  }

  static validateStep2(data: OnboardingStep2Data): string | null {
    if (data.defaultBerasPerJiwa <= 0) {
      return 'Beras per jiwa harus lebih dari 0';
    }
    if (data.defaultUangPerJiwa <= 0) {
      return 'Uang per jiwa harus lebih dari 0';
    }
    if (data.yearHijri < 1400 || data.yearHijri > 1500) {
      return 'Tahun Hijriyah tidak valid';
    }
    if (data.yearMasehi < 2000 || data.yearMasehi > 2100) {
      return 'Tahun Masehi tidak valid';
    }
    return null;
  }

  static validateStep3(data: OnboardingStep3Data): string | null {
    if (!data.sectors || data.sectors.length === 0) {
      return 'Minimal 1 sektor diperlukan';
    }
    for (const sector of data.sectors) {
      if (!sector.name || sector.name.length < 2) {
        return 'Nama sektor minimal 2 karakter';
      }
    }
    return null;
  }
}

// Helper functions
export async function createOnboardingSession(
  db: Kysely<Database>,
  userId: string
): Promise<string> {
  return new OnboardingService(db).createSession(userId);
}

export async function completeOnboarding(
  db: Kysely<Database>,
  userId: string
): Promise<{ organizationId: string; slug: string }> {
  return new OnboardingService(db).completeOnboarding(userId);
}

export async function getOnboardingSession(
  db: Kysely<Database>,
  userId: string
): Promise<OnboardingSession | undefined> {
  return new OnboardingService(db).getSession(userId);
}
