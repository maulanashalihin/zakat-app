# Database Schema - Zakat App (Multi-Organization)

## Schema Changes Summary

### Multi-Organization Architecture
Setiap lembaga/masjid adalah satu **Organization** yang terisolasi:
- Data muzaki, mustahik, sektor terpisah per organization
- User terdaftar di satu organization (kecuali Super Admin yang bisa manage semua)
- Setting zakat berbeda per organization

### Existing Tables Used
- `users` - Extended with role, organization_id
- `sessions` - No changes

### New Tables
1. `organizations` - Master lembaga/masjid
2. `sectors` - Master wilayah/sektor (per organization)
3. `periods` - Master periode zakat (per organization)
4. `muzaki` - Data pembayar zakat (per organization)
5. `mustahik` - Data penerima zakat (per organization)
6. `mustahik_allocations` - Alokasi per mustahik
7. `central_aid` - Bantuan pusat/zakat maal (per organization)
8. `distributions` - Distribusi zakat
9. `attachments` - File bukti distribusi
10. `audit_logs` - Audit trail (per organization)
11. `app_settings` - Konfigurasi aplikasi (per organization)

---

## Modified Tables

### users

**Existing columns:** id, email, name, bio, location, website, password_hash, provider, google_id, avatar, email_verified, is_admin, created_at, updated_at

**New columns:**
```typescript
role: text('role', { 
  enum: ['super_admin', 'admin', 'petugas', 'viewer'] 
}).notNull().default('viewer'),
organization_id: text('organization_id')
  .references(() => organizations.id, { onDelete: 'cascade' }),
sector_id: text('sector_id').references(() => sectors.id),
is_active: integer('is_active', { mode: 'boolean' }).default(true)
```

**Kysely Type:**
```typescript
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
  role: 'super_admin' | 'admin' | 'petugas' | 'viewer';
  organization_id: string | null; // null for super_admin
  sector_id: string | null; // for petugas role
  is_active: number | null;
  created_at: number | null;
  updated_at: number | null;
}
```

---

## New Tables

### 1. organizations (Master Lembaga/Masjid)

```typescript
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // Nama lembaga/masjid
  slug: text('slug').notNull().unique(), // URL-friendly name
  
  // Contact info
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  
  // Branding
  logo_url: text('logo_url'),
  primary_color: text('primary_color').default('#3b82f6'),
  
  // Subscription/Status
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  plan: text('plan', { enum: ['free', 'basic', 'premium'] }).default('free'),
  
  // Timestamps
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updated_at: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 2. sectors (Master Wilayah/Sektor - per Organization)

```typescript
export const sectors = sqliteTable('sectors', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // e.g., "Banjaran"
  description: text('description'),
  color: text('color').default('#3b82f6'), // For UI badge
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updated_at: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
sectors: {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  color: string | null;
  is_active: number | null;
  created_at: number | null;
  updated_at: number | null;
}
```

---

### 3. periods (Master Periode Zakat - per Organization)

```typescript
export const periods = sqliteTable('periods', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  year_hijri: integer('year_hijri').notNull(), // 1445, 1446, etc
  year_masehi: integer('year_masehi').notNull(), // 2024, 2025, etc
  name: text('name').notNull(), // "Ramadhan 1445 H"
  start_date: integer('start_date', { mode: 'number' }),
  end_date: integer('end_date', { mode: 'number' }),
  is_active: integer('is_active', { mode: 'boolean' }).default(false),
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 4. muzaki (Data Pembayar Zakat - per Organization)

```typescript
export const muzaki = sqliteTable('muzaki', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  sector_id: text('sector_id')
    .notNull()
    .references(() => sectors.id, { onDelete: 'restrict' }),
  jumlah_jiwa: integer('jumlah_jiwa').notNull().default(1),
  
  // Zakat payment type
  jenis_zakat: text('jenis_zakat', { 
    enum: ['beras', 'uang', 'keduanya'] 
  }).notNull(),
  
  // Payment details
  jumlah_beras: real('jumlah_beras').default(0), // in kg
  jumlah_uang: integer('jumlah_uang').default(0), // in rupiah
  infaq: integer('infaq').default(0), // additional donation
  
  // Metadata
  petugas_id: text('petugas_id')
    .notNull()
    .references(() => users.id),
  periode_id: text('periode_id')
    .references(() => periods.id),
  notes: text('notes'),
  
  // Timestamps
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updated_at: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 5. mustahik (Data Penerima Zakat - per Organization)

```typescript
export const mustahik = sqliteTable('mustahik', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Kepala keluarga
  address: text('address').notNull(),
  sector_id: text('sector_id')
    .notNull()
    .references(() => sectors.id, { onDelete: 'restrict' }),
  
  // Demographics
  pekerjaan: text('pekerjaan'),
  deskripsi_kondisi: text('deskripsi_kondisi'),
  tanggungan: integer('tanggungan').default(0),
  jumlah_jiwa: integer('jumlah_jiwa').notNull().default(1),
  
  // Priority/Category
  kategori_prioritas: text('kategori_prioritas', {
    enum: ['tinggi', 'sedang', 'rendah']
  }).default('sedang'),
  
  // Status
  status_distribusi: text('status_distribusi', {
    enum: ['belum_disalurkan', 'siap_disalurkan', 'sudah_disalurkan']
  }).default('belum_disalurkan'),
  
  // Distribution metadata
  tanggal_distribusi: integer('tanggal_distribusi', { mode: 'number' }),
  petugas_penyalur_id: text('petugas_penyalur_id')
    .references(() => users.id),
  catatan_distribusi: text('catatan_distribusi'),
  
  // Periode
  periode_id: text('periode_id')
    .references(() => periods.id),
  
  // Timestamps
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updated_at: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
  kategori_prioritas: 'tinggi' | 'sedang' | 'rendah' | null;
  status_distribusi: 'belum_disalurkan' | 'siap_disalurkan' | 'sudah_disalurkan' | null;
  tanggal_distribusi: number | null;
  petugas_penyalur_id: string | null;
  catatan_distribusi: string | null;
  periode_id: string | null;
  created_at: number | null;
  updated_at: number | null;
}
```

---

### 6. mustahik_allocations (Alokasi per Mustahik)

```typescript
export const mustahikAllocations = sqliteTable('mustahik_allocations', {
  id: text('id').primaryKey(),
  mustahik_id: text('mustahik_id')
    .notNull()
    .references(() => mustahik.id, { onDelete: 'cascade' }),
  periode_id: text('periode_id')
    .references(() => periods.id),
  
  // Local zakat (mahaliyah)
  alokasi_beras: real('alokasi_beras').default(0), // kg
  alokasi_uang_lokal: integer('alokasi_uang_lokal').default(0), // rupiah
  
  // Central aid (from bantuan_pusat)
  bantuan_pusat_id: text('bantuan_pusat_id')
    .references(() => centralAid.id),
  
  // Total
  total_bantuan: integer('total_bantuan').default(0),
  
  // Status
  sudah_diterima: integer('sudah_diterima', { mode: 'boolean' }).default(false),
  tanggal_diterima: integer('tanggal_diterima', { mode: 'number' }),
  
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 7. central_aid (Bantuan Pusat / Zakat Maal - per Organization)

```typescript
export const centralAid = sqliteTable('central_aid', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  
  // Recipient
  mustahik_id: text('mustahik_id')
    .references(() => mustahik.id, { onDelete: 'set null' }),
  
  // Source info
  sumber_dana: text('sumber_dana').notNull(),
  keterangan_sumber: text('keterangan_sumber'),
  
  // Amount
  nominal: integer('nominal').notNull(), // rupiah
  
  // Status
  status_pencairan: text('status_pencairan', {
    enum: ['pending', 'cair', 'batal']
  }).default('pending'),
  tanggal_cair: integer('tanggal_cair', { mode: 'number' }),
  
  // Metadata
  periode_id: text('periode_id')
    .references(() => periods.id),
  catatan: text('catatan'),
  
  // Timestamps
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  updated_at: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 8. distributions (Rekaman Distribusi)

```typescript
export const distributions = sqliteTable('distributions', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  
  // Links
  mustahik_id: text('mustahik_id')
    .notNull()
    .references(() => mustahik.id, { onDelete: 'cascade' }),
  mustahik_allocation_id: text('mustahik_allocation_id')
    .references(() => mustahikAllocations.id),
  
  // Distribution details
  tanggal_distribusi: integer('tanggal_distribusi', { mode: 'number' }).notNull(),
  petugas_id: text('petugas_id')
    .notNull()
    .references(() => users.id),
  
  // What was distributed
  jumlah_beras: real('jumlah_beras').default(0),
  jumlah_uang: integer('jumlah_uang').default(0),
  
  // Status
  status: text('status', {
    enum: ['berhasil', 'gagal', 'pending']
  }).default('berhasil'),
  
  // Proof
  bukti_foto_url: text('bukti_foto_url'),
  
  // Notes
  catatan: text('catatan'),
  
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 9. attachments (File Bukti)

```typescript
export const attachments = sqliteTable('attachments', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  
  // Polymorphic reference
  entity_type: text('entity_type', {
    enum: ['distribution', 'mustahik', 'muzaki']
  }).notNull(),
  entity_id: text('entity_id').notNull(),
  
  // File info
  file_name: text('file_name').notNull(),
  file_url: text('file_url').notNull(),
  file_type: text('file_type'), // mime type
  file_size: integer('file_size'), // in bytes
  
  // Metadata
  uploaded_by: text('uploaded_by')
    .references(() => users.id),
  description: text('description'),
  
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 10. audit_logs (Audit Trail - per Organization)

```typescript
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  
  // Who
  user_id: text('user_id')
    .references(() => users.id),
  user_name: text('user_name'), // Snapshot
  
  // What
  action: text('action', {
    enum: ['create', 'update', 'delete', 'login', 'logout', 'export']
  }).notNull(),
  table_name: text('table_name').notNull(),
  record_id: text('record_id').notNull(),
  
  // Data snapshot
  old_data: text('old_data'), // JSON
  new_data: text('new_data'), // JSON
  
  // Context
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  
  created_at: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
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
}
```

---

### 11. app_settings (Konfigurasi Aplikasi - per Organization)

```typescript
export const appSettings = sqliteTable('app_settings', {
  id: text('id').primaryKey(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' })
    .unique(), // One settings per organization
  
  // Zakat calculation defaults
  default_beras_per_jiwa: real('default_beras_per_jiwa').default(2.5),
  default_uang_per_jiwa: integer('default_uang_per_jiwa').default(40000),
  
  // Current active period
  active_period_id: text('active_period_id')
    .references(() => periods.id),
  
  // Features
  enable_email_notifications: integer('enable_email_notifications', { mode: 'boolean' }).default(false),
  require_approval_for_changes: integer('require_approval_for_changes', { mode: 'boolean' }).default(false),
  
  updated_at: integer('updated_at', { mode: 'number' }).$defaultFn(() => Date.now())
});
```

**Kysely Type:**
```typescript
app_settings: {
  id: string;
  organization_id: string;
  default_beras_per_jiwa: number | null;
  default_uang_per_jiwa: number | null;
  active_period_id: string | null;
  enable_email_notifications: number | null;
  require_approval_for_changes: number | null;
  updated_at: number | null;
}
```

---

## Data Isolation Rules

### Query Pattern (MANDATORY)

**Every query MUST filter by organization_id:**

```typescript
// ✅ CORRECT - With organization filter
const muzaki = await locals.db
  .selectFrom('muzaki')
  .selectAll()
  .where('organization_id', '=', locals.user.organization_id)
  .execute();

// ✅ CORRECT - Super admin viewing specific org
const muzaki = await locals.db
  .selectFrom('muzaki')
  .selectAll()
  .where('organization_id', '=', params.orgId)
  .execute();

// ❌ WRONG - Missing organization filter
const muzaki = await locals.db
  .selectFrom('muzaki')
  .selectAll()
  .execute();
```

### Organization Context Resolution

```typescript
// src/lib/auth/organization.ts
export function getOrganizationId(locals: App.Locals): string | null {
  // Super admin can access any org (from query param or session)
  if (locals.user.role === 'super_admin') {
    return locals.session.orgId || null; // null = view all
  }
  
  // Regular user = their assigned org
  return locals.user.organization_id;
}

export function requireOrganization(locals: App.Locals): string {
  const orgId = getOrganizationId(locals);
  if (!orgId) {
    throw error(400, 'Organization required');
  }
  return orgId;
}
```

---

## Relations

```typescript
// organizations relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  sectors: many(sectors),
  periods: many(periods),
  muzaki: many(muzaki),
  mustahik: many(mustahik),
  settings: one(appSettings)
}));

// users relations
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organization_id],
    references: [organizations.id]
  }),
  sector: one(sectors, {
    fields: [users.sector_id],
    references: [sectors.id]
  })
}));

// sectors relations
export const sectorsRelations = relations(sectors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [sectors.organization_id],
    references: [organizations.id]
  }),
  muzaki: many(muzaki),
  mustahik: many(mustahik),
  users: many(users)
}));
```

---

## Indexes

```sql
-- Organization-scoped unique indexes
CREATE UNIQUE INDEX idx_sectors_org_name ON sectors(organization_id, name);
CREATE UNIQUE INDEX idx_periods_org_name ON periods(organization_id, name);
CREATE UNIQUE INDEX idx_app_settings_org ON app_settings(organization_id);

-- Foreign key indexes
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_sector ON users(sector_id);
CREATE INDEX idx_muzaki_org ON muzaki(organization_id);
CREATE INDEX idx_muzaki_sector ON muzaki(sector_id);
CREATE INDEX idx_mustahik_org ON mustahik(organization_id);
CREATE INDEX idx_mustahik_sector ON mustahik(sector_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id);
```

---

## Type Exports (index.ts)

```typescript
// Table Types
export type Organization = Database['organizations'];
export type Sector = Database['sectors'];
export type Period = Database['periods'];
export type Muzaki = Database['muzaki'];
export type Mustahik = Database['mustahik'];
export type MustahikAllocation = Database['mustahik_allocations'];
export type CentralAid = Database['central_aid'];
export type Distribution = Database['distributions'];
export type Attachment = Database['attachments'];
export type AuditLog = Database['audit_logs'];
export type AppSetting = Database['app_settings'];

// Insert Types
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
```
