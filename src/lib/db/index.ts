// ============================================================================
// Database Exports
// ============================================================================

export * as schema from './schema';

// ============================================================================
// Kysely Database Types (from Drizzle Schema)
// ============================================================================
// CONVERSION RULES:
// - Drizzle camelCase → Kysely snake_case
// - Drizzle integer(..., { mode: 'boolean' }) → Kysely number | null
// - Drizzle $defaultFn(...) fields → Kysely nullable

export interface Database {
  // Core auth tables
  users: {
    id: string;
    email: string;
    name: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    password_hash: string | null;
    provider: 'email' | 'google';
    google_id: string | null;
    avatar: string | null;
    email_verified: number | null;
    is_admin: number | null;
    // ⭐ NEW: Global role and primary organization
    global_role: 'super_admin' | 'user';
    primary_organization_id: string | null;
    sector_id: string | null;
    is_active: number | null;
    created_at: number | null;
    updated_at: number | null;
  };

  // ⭐ NEW: Organization Members (many-to-many)
  organization_members: {
    id: string;
    user_id: string;
    organization_id: string;
    role: 'admin' | 'petugas' | 'viewer';
    sector_id: string | null;
    is_active: number | null;
    joined_at: number | null;
    created_at: number | null;
    updated_at: number | null;
  };

  sessions: {
    id: string;
    user_id: string;
    expires_at: number;
  };

  password_reset_tokens: {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: number;
    used: number;
    created_at: number;
  };

  email_verification_tokens: {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: number;
    used: number;
    created_at: number;
  };

  // ⭐ NEW: Multi-organization tables
  organizations: {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
    primary_color: string | null;
    is_active: number | null;
    plan: 'free' | 'basic' | 'premium' | null;
    created_at: number | null;
    updated_at: number | null;
  };

  sectors: {
    id: string;
    organization_id: string;
    name: string;
    description: string | null;
    color: string | null;
    is_active: number | null;
    created_at: number | null;
    updated_at: number | null;
  };

  periods: {
    id: string;
    organization_id: string;
    year_hijri: number;
    year_masehi: number;
    name: string;
    start_date: number | null;
    end_date: number | null;
    is_active: number | null;
    created_at: number | null;
  };

  muzaki: {
    id: string;
    organization_id: string;
    name: string;
    address: string;
    sector_id: string;
    jumlah_jiwa: number;
    jenis_zakat: 'beras' | 'uang' | 'keduanya';
    jumlah_beras: number | null;
    jumlah_uang: number | null;
    infaq: number | null;
    petugas_id: string;
    periode_id: string | null;
    notes: string | null;
    created_at: number | null;
    updated_at: number | null;
  };

  mustahik: {
    id: string;
    organization_id: string;
    name: string;
    address: string;
    sector_id: string;
    pekerjaan: string | null;
    deskripsi_kondisi: string | null;
    tanggungan: number | null;
    jumlah_jiwa: number;
    kategori_asnaf: 'fakir' | 'miskin' | 'amil' | 'mualaf' | 'riqab' | 'gharim' | 'fisabilillah' | 'ibnu_sabil' | null;
    kategori_prioritas: 'tinggi' | 'sedang' | 'rendah' | null;
    status_distribusi: 'belum_disalurkan' | 'siap_disalurkan' | 'sudah_disalurkan' | null;
    tanggal_distribusi: number | null;
    petugas_penyalur_id: string | null;
    catatan_distribusi: string | null;
    periode_id: string | null;
    created_at: number | null;
    updated_at: number | null;
  };

  mustahik_allocations: {
    id: string;
    mustahik_id: string;
    periode_id: string | null;
    alokasi_beras: number | null;
    alokasi_uang_lokal: number | null;
    bantuan_pusat_id: string | null;
    total_bantuan: number | null;
    sudah_diterima: number | null;
    tanggal_diterima: number | null;
    created_at: number | null;
  };

  central_aid: {
    id: string;
    organization_id: string;
    mustahik_id: string | null;
    sumber_dana: string;
    keterangan_sumber: string | null;
    nominal: number;
    status_pencairan: 'pending' | 'cair' | 'batal' | null;
    tanggal_cair: number | null;
    periode_id: string | null;
    catatan: string | null;
    created_at: number | null;
    updated_at: number | null;
  };

  distributions: {
    id: string;
    organization_id: string;
    mustahik_id: string;
    mustahik_allocation_id: string | null;
    tanggal_distribusi: number;
    petugas_id: string;
    jumlah_beras: number | null;
    jumlah_uang: number | null;
    status: 'berhasil' | 'gagal' | 'pending' | null;
    bukti_foto_url: string | null;
    catatan: string | null;
    created_at: number | null;
  };

  attachments: {
    id: string;
    organization_id: string;
    entity_type: 'distribution' | 'mustahik' | 'muzaki';
    entity_id: string;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
    uploaded_by: string | null;
    description: string | null;
    created_at: number | null;
  };

  audit_logs: {
    id: string;
    organization_id: string;
    user_id: string | null;
    user_name: string | null;
    action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export';
    table_name: string;
    record_id: string;
    old_data: string | null;
    new_data: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: number | null;
  };

  app_settings: {
    id: string;
    organization_id: string;
    default_beras_per_jiwa: number | null;
    default_uang_per_jiwa: number | null;
    active_period_id: string | null;
    enable_email_notifications: number | null;
    require_approval_for_changes: number | null;
    updated_at: number | null;
  };

  onboarding_sessions: {
    id: string;
    user_id: string;
    current_step: number;
    completed_steps: string; // JSON
    is_completed: number | null;
    temp_data: string | null; // JSON
    created_organization_id: string | null;
    started_at: number | null;
    completed_at: number | null;
    expires_at: number | null;
  };
}

/** Alias for Database interface */
export type DB = Database;

// ============================================================================
// Table Types
// ============================================================================

// Core auth
export type User = Database['users'];
export type Session = Database['sessions'];
export type PasswordResetToken = Database['password_reset_tokens'];
export type EmailVerificationToken = Database['email_verification_tokens'];

// Multi-organization
export type Organization = Database['organizations'];
export type Sector = Database['sectors'];
export type Period = Database['periods'];

// Zakat management
export type Muzaki = Database['muzaki'];
export type Mustahik = Database['mustahik'];
export type MustahikAllocation = Database['mustahik_allocations'];
export type CentralAid = Database['central_aid'];
export type Distribution = Database['distributions'];
export type Attachment = Database['attachments'];
export type AuditLog = Database['audit_logs'];
export type AppSetting = Database['app_settings'];
export type OnboardingSession = Database['onboarding_sessions'];

// ============================================================================
// Insert Types (omit auto-generated fields)
// ============================================================================

export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type NewSession = Session;
export type NewPasswordResetToken = PasswordResetToken;
export type NewEmailVerificationToken = EmailVerificationToken;

export type NewOrganization = Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
export type NewSector = Omit<Sector, 'id' | 'created_at' | 'updated_at'>;
export type NewPeriod = Omit<Period, 'id' | 'created_at'>;
export type NewMuzaki = Omit<Muzaki, 'id' | 'created_at' | 'updated_at'>;
export type NewMustahik = Omit<Mustahik, 'id' | 'created_at' | 'updated_at'>;
export type NewMustahikAllocation = Omit<MustahikAllocation, 'id' | 'created_at'>;
export type NewCentralAid = Omit<CentralAid, 'id' | 'created_at' | 'updated_at'>;
export type NewDistribution = Omit<Distribution, 'id' | 'created_at'>;
export type NewAttachment = Omit<Attachment, 'id' | 'created_at'>;
export type NewAuditLog = Omit<AuditLog, 'id' | 'created_at'>;
export type NewAppSetting = Omit<AppSetting, 'id' | 'updated_at'>;
export type NewOnboardingSession = Omit<OnboardingSession, 'id' | 'started_at'>;

// ============================================================================
// Auth Types
// ============================================================================

export type AuthProvider = 'email' | 'google';
export type GlobalUserRole = 'super_admin' | 'user';
export type OrganizationRole = 'admin' | 'petugas' | 'viewer';
export type UserRole = GlobalUserRole | OrganizationRole; // Legacy support

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

// ============================================================================
// Organization Types
// ============================================================================

export interface OrganizationCreateInput {
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

// ⭐ NEW: Organization Member types
export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  sectorId: string | null;
  isActive: boolean;
  joinedAt: number;
}

export interface UserMembership {
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  role: OrganizationRole;
  sectorId: string | null;
  isActive: boolean;
}

export interface ZakatSettingsInput {
  defaultBerasPerJiwa: number;
  defaultUangPerJiwa: number;
  yearHijri: number;
  yearMasehi: number;
}

// ============================================================================
// Legacy Aliases (backward compatibility)
// ============================================================================

/** @deprecated Use `Session` instead */
export type DbSession = Session;
