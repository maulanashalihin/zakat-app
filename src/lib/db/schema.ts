import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// CORE AUTH TABLES (existing)
// ============================================================================

// Users table with auth support - EXTENDED with role and organization
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  // Auth fields
  passwordHash: text('password_hash'),
  provider: text('provider', { enum: ['email', 'google'] }).notNull().default('email'),
  googleId: text('google_id').unique(),
  avatar: text('avatar'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
  // ⭐ NEW: Role and Organization fields
  role: text('role', { enum: ['super_admin', 'admin', 'petugas', 'viewer'] }).notNull().default('viewer'),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  sectorId: text('sector_id').references(() => sectors.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  // Timestamps
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Sessions table
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'number' }).notNull()
});

// Password reset tokens
export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: integer('expires_at', { mode: 'number' }).notNull(),
  used: integer('used', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Email verification tokens
export const emailVerificationTokens = sqliteTable('email_verification_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: integer('expires_at', { mode: 'number' }).notNull(),
  used: integer('used', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// ============================================================================
// MULTI-ORGANIZATION TABLES (NEW)
// ============================================================================

// Organizations table - root of multi-tenancy
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  // Contact info
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  // Branding
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').default('#3b82f6'),
  // Status
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  plan: text('plan', { enum: ['free', 'basic', 'premium'] }).default('free'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// ============================================================================
// ZAKAT MANAGEMENT TABLES (NEW)
// ============================================================================

// Sectors/Wilayah - per organization
export const sectors = sqliteTable('sectors', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('#3b82f6'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Periods - per organization
export const periods = sqliteTable('periods', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  yearHijri: integer('year_hijri').notNull(),
  yearMasehi: integer('year_masehi').notNull(),
  name: text('name').notNull(),
  startDate: integer('start_date', { mode: 'number' }),
  endDate: integer('end_date', { mode: 'number' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Muzaki - pembayar zakat
export const muzaki = sqliteTable('muzaki', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  sectorId: text('sector_id')
    .notNull()
    .references(() => sectors.id, { onDelete: 'restrict' }),
  jumlahJiwa: integer('jumlah_jiwa').notNull().default(1),
  // Zakat payment
  jenisZakat: text('jenis_zakat', { enum: ['beras', 'uang', 'keduanya'] }).notNull(),
  jumlahBeras: real('jumlah_beras').default(0),
  jumlahUang: integer('jumlah_uang').default(0),
  infaq: integer('infaq').default(0),
  // Metadata
  petugasId: text('petugas_id')
    .notNull()
    .references(() => users.id),
  periodeId: text('periode_id')
    .references(() => periods.id),
  notes: text('notes'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Mustahik - penerima zakat
export const mustahik = sqliteTable('mustahik', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  sectorId: text('sector_id')
    .notNull()
    .references(() => sectors.id, { onDelete: 'restrict' }),
  // Demographics
  pekerjaan: text('pekerjaan'),
  deskripsiKondisi: text('deskripsi_kondisi'),
  tanggungan: integer('tanggungan').default(0),
  jumlahJiwa: integer('jumlah_jiwa').notNull().default(1),
  // Priority
  kategoriPrioritas: text('kategori_prioritas', {
    enum: ['tinggi', 'sedang', 'rendah']
  }).default('sedang'),
  // Distribution status
  statusDistribusi: text('status_distribusi', {
    enum: ['belum_disalurkan', 'siap_disalurkan', 'sudah_disalurkan']
  }).default('belum_disalurkan'),
  tanggalDistribusi: integer('tanggal_distribusi', { mode: 'number' }),
  petugasPenyalurId: text('petugas_penyalur_id')
    .references(() => users.id),
  catatanDistribusi: text('catatan_distribusi'),
  // Periode
  periodeId: text('periode_id')
    .references(() => periods.id),
  // Timestamps
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Mustahik allocations
export const mustahikAllocations = sqliteTable('mustahik_allocations', {
  id: text('id').primaryKey(),
  mustahikId: text('mustahik_id')
    .notNull()
    .references(() => mustahik.id, { onDelete: 'cascade' }),
  periodeId: text('periode_id')
    .references(() => periods.id),
  // Local zakat
  alokasiBeras: real('alokasi_beras').default(0),
  alokasiUangLokal: integer('alokasi_uang_lokal').default(0),
  // Central aid
  bantuanPusatId: text('bantuan_pusat_id')
    .references(() => centralAid.id),
  totalBantuan: integer('total_bantuan').default(0),
  // Status
  sudahDiterima: integer('sudah_diterima', { mode: 'boolean' }).default(false),
  tanggalDiterima: integer('tanggal_diterima', { mode: 'number' }),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Central aid / Bantuan pusat
export const centralAid = sqliteTable('central_aid', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  mustahikId: text('mustahik_id')
    .references(() => mustahik.id, { onDelete: 'set null' }),
  sumberDana: text('sumber_dana').notNull(),
  keteranganSumber: text('keterangan_sumber'),
  nominal: integer('nominal').notNull(),
  statusPencairan: text('status_pencairan', {
    enum: ['pending', 'cair', 'batal']
  }).default('pending'),
  tanggalCair: integer('tanggal_cair', { mode: 'number' }),
  periodeId: text('periode_id')
    .references(() => periods.id),
  catatan: text('catatan'),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Distributions
export const distributions = sqliteTable('distributions', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  mustahikId: text('mustahik_id')
    .notNull()
    .references(() => mustahik.id, { onDelete: 'cascade' }),
  mustahikAllocationId: text('mustahik_allocation_id')
    .references(() => mustahikAllocations.id),
  tanggalDistribusi: integer('tanggal_distribusi', { mode: 'number' }).notNull(),
  petugasId: text('petugas_id')
    .notNull()
    .references(() => users.id),
  jumlahBeras: real('jumlah_beras').default(0),
  jumlahUang: integer('jumlah_uang').default(0),
  status: text('status', {
    enum: ['berhasil', 'gagal', 'pending']
  }).default('berhasil'),
  buktiFotoUrl: text('bukti_foto_url'),
  catatan: text('catatan'),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Attachments
export const attachments = sqliteTable('attachments', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  entityType: text('entity_type', {
    enum: ['distribution', 'mustahik', 'muzaki']
  }).notNull(),
  entityId: text('entity_id').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type'),
  fileSize: integer('file_size'),
  uploadedBy: text('uploaded_by')
    .references(() => users.id),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Audit logs
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .references(() => users.id),
  userName: text('user_name'),
  action: text('action', {
    enum: ['create', 'update', 'delete', 'login', 'logout', 'export']
  }).notNull(),
  tableName: text('table_name').notNull(),
  recordId: text('record_id').notNull(),
  oldData: text('old_data'),
  newData: text('new_data'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// App settings - per organization
export const appSettings = sqliteTable('app_settings', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' })
    .unique(),
  // Zakat defaults
  defaultBerasPerJiwa: real('default_beras_per_jiwa').default(2.5),
  defaultUangPerJiwa: integer('default_uang_per_jiwa').default(40000),
  // Active period
  activePeriodId: text('active_period_id')
    .references(() => periods.id),
  // Features
  enableEmailNotifications: integer('enable_email_notifications', { mode: 'boolean' }).default(false),
  requireApprovalForChanges: integer('require_approval_for_changes', { mode: 'boolean' }).default(false),
  updatedAt: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});

// Onboarding sessions
export const onboardingSessions = sqliteTable('onboarding_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  currentStep: integer('current_step').notNull().default(1),
  completedSteps: text('completed_steps').default('[]'),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false),
  tempData: text('temp_data'),
  createdOrganizationId: text('created_organization_id')
    .references(() => organizations.id),
  startedAt: integer('started_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  completedAt: integer('completed_at', { mode: 'number' }),
  expiresAt: integer('expires_at', { mode: 'number' })
});

// ============================================================================
// RELATIONS
// ============================================================================

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  sectors: many(sectors),
  periods: many(periods),
  muzaki: many(muzaki),
  mustahik: many(mustahik),
  settings: many(appSettings)
}));

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id]
  }),
  sector: one(sectors, {
    fields: [users.sectorId],
    references: [sectors.id]
  })
}));

export const sectorsRelations = relations(sectors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [sectors.organizationId],
    references: [organizations.id]
  }),
  muzaki: many(muzaki),
  mustahik: many(mustahik),
  users: many(users)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id]
  })
}));

export const emailVerificationTokensRelations = relations(emailVerificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [emailVerificationTokens.userId],
    references: [users.id]
  })
}));

export const muzakiRelations = relations(muzaki, ({ one }) => ({
  organization: one(organizations, {
    fields: [muzaki.organizationId],
    references: [organizations.id]
  }),
  sector: one(sectors, {
    fields: [muzaki.sectorId],
    references: [sectors.id]
  }),
  petugas: one(users, {
    fields: [muzaki.petugasId],
    references: [users.id]
  }),
  periode: one(periods, {
    fields: [muzaki.periodeId],
    references: [periods.id]
  })
}));

export const mustahikRelations = relations(mustahik, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [mustahik.organizationId],
    references: [organizations.id]
  }),
  sector: one(sectors, {
    fields: [mustahik.sectorId],
    references: [sectors.id]
  }),
  allocations: many(mustahikAllocations),
  distributions: many(distributions)
}));

export const mustahikAllocationsRelations = relations(mustahikAllocations, ({ one }) => ({
  mustahik: one(mustahik, {
    fields: [mustahikAllocations.mustahikId],
    references: [mustahik.id]
  }),
  bantuanPusat: one(centralAid, {
    fields: [mustahikAllocations.bantuanPusatId],
    references: [centralAid.id]
  })
}));
