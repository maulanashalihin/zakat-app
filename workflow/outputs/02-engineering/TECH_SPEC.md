# Technical Specification - Zakat App (Multi-Organization)

## Overview
Aplikasi pengelolaan zakat fitrah **multi-organisasi** - setiap lembaga/masjid memiliki data terpisah dengan pengelola masing-masing.

## Multi-Organization Architecture

### Konsep
- **Organization** = Satu lembaga zakat/masjid (e.g., Masjid Al-Hidayah, Masjid Nurul Iman)
- Setiap Organization memiliki:
  - Pengurus/Admin sendiri
  - Petugas/Amil sendiri
  - Sektor/wilayah sendiri
  - Data muzaki & mustahik sendiri
  - Setting zakat sendiri
- **Super Admin** dapat mengelola semua organization
- **Data Isolation** - User hanya lihat data organization-nya

### URL Structure
```
/                       → Landing page / Organization selector
/o/[orgSlug]/dashboard  → Dashboard specific org
/o/[orgSlug]/muzaki     → Muzaki org tersebut
/admin/organizations    → Super admin manage all orgs
```

---

## Tech Stack
- **Framework**: SvelteKit 2.x + Svelte 5 Runes
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle (schema) + Kysely (runtime queries)
- **Styling**: Tailwind CSS 4.x
- **Charts**: Chart.js / svelte-chartjs
- **Export**: CSV generation + PDF (print-friendly CSS)

---

## Role & Permission Matrix

### Role Hierarchy

| Role | Scope | Description |
|------|-------|-------------|
| **Super Admin** | Global | Manage all organizations, create new org |
| **Admin** | Organization | Manage their org data, users, settings |
| **Petugas** | Sector | Input muzaki, distribusi di sektor tertentu |
| **Viewer** | Organization | View only laporan & dashboard |

### Permission Matrix

| Feature | Super Admin | Admin | Petugas | Viewer |
|---------|-------------|-------|---------|--------|
| Manage Organizations | ✅ | ❌ | ❌ | ❌ |
| Manage Users (all orgs) | ✅ | ❌ | ❌ | ❌ |
| Manage Users (own org) | ✅ | ✅ | ❌ | ❌ |
| Master Data (own org) | ✅ | ✅ | ❌ | ❌ |
| Input Muzaki | ✅ | ✅ | ✅ (own sector) | ❌ |
| Edit Muzaki | ✅ | ✅ | ✅ (own input) | ❌ |
| Input Mustahik | ✅ | ✅ | ❌ | ❌ |
| Distribusi | ✅ | ✅ | ✅ (own sector) | ❌ |
| View Dashboard | ✅ (all orgs) | ✅ (own org) | ✅ (own sector) | ✅ (own org) |
| View Reports | ✅ (all orgs) | ✅ (own org) | ✅ (own sector) | ✅ (own org) |
| Export Data | ✅ | ✅ | ❌ | ✅ |
| Audit Log | ✅ | ✅ (own org) | ❌ | ❌ |

---

## Data Isolation Rules

### 1. Row-Level Security
Setiap query WAJIB filter berdasarkan `organization_id`:

```typescript
// Server load pattern
export const load: PageServerLoad = async ({ locals, params }) => {
  const orgId = resolveOrganizationId(locals, params);
  
  const muzaki = await locals.db
    .selectFrom('muzaki')
    .selectAll()
    .where('organization_id', '=', orgId)  // ⭐ MANDATORY
    .execute();
  
  return { muzaki };
};
```

### 2. Organization Resolution

```typescript
// src/lib/auth/organization.ts

export function resolveOrganizationId(
  locals: App.Locals, 
  params?: { orgSlug?: string }
): string {
  // Super admin dengan specific org slug
  if (locals.user.role === 'super_admin' && params?.orgSlug) {
    return getOrgIdBySlug(params.orgSlug);
  }
  
  // Super admin tanpa org = error
  if (locals.user.role === 'super_admin') {
    throw redirect(302, '/admin/organizations');
  }
  
  // Regular user = their org
  if (!locals.user.organization_id) {
    throw error(403, 'No organization assigned');
  }
  
  return locals.user.organization_id;
}

export function canAccessOrganization(
  user: User, 
  orgId: string
): boolean {
  if (user.role === 'super_admin') return true;
  return user.organization_id === orgId;
}
```

### 3. Route Guards

```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ locals, params }) => {
  // 1. Check auth
  if (!locals.user) throw redirect(302, '/login');
  
  // 2. Resolve organization
  const orgId = resolveOrganizationId(locals, params);
  
  // 3. Verify access
  if (!canAccessOrganization(locals.user, orgId)) {
    throw error(403, 'Access denied');
  }
  
  // 4. Load org context
  const organization = await locals.db
    .selectFrom('organizations')
    .selectAll()
    .where('id', '=', orgId)
    .executeTakeFirst();
  
  // 5. Load data with org filter
  const data = await locals.db
    .selectFrom('muzaki')
    .selectAll()
    .where('organization_id', '=', orgId)
    .execute();
  
  return { organization, data };
};
```

---

## Phase Implementation

### Phase 1: Core Multi-Org
| Feature | Status | Complexity |
|---------|--------|------------|
| Organizations table & CRUD | Core | Medium |
| User-Organization relation | Core | Medium |
| Org-scoped data (sectors, etc) | Core | High |
| Super Admin dashboard | Core | Medium |
| Organization selector | Core | Low |

### Phase 2: Zakat Operations
| Feature | Status | Complexity |
|---------|--------|------------|
| Muzaki Management | Core | Medium |
| Mustahik Management | Core | Medium |
| Dashboard Summary | Core | Medium |
| Rekap Per Sektor | Core | High |

### Phase 3: Extended Features
| Feature | Status | Complexity |
|---------|--------|------------|
| Bantuan Pusat | Extended | Medium |
| Distribusi Module | Extended | High |
| Laporan & Export | Extended | Medium |
| Grafik Dashboard | Extended | Medium |

### Phase 4: Advanced
| Feature | Status | Complexity |
|---------|--------|------------|
| Audit Log | Advanced | Medium |
| Import Spreadsheet | Advanced | High |
| Duplicate Checker | Advanced | Medium |

---

## Core Business Logic

### 1. Zakat Fitrah Calculation (per Organization)
```
total_uang_muzaki = uang_zakat + infaq
total_beras_masuk = SUM(beras) per sektor WHERE org_id = X
total_uang_masuk = SUM(uang_zakat) per sektor WHERE org_id = X
```

### 2. Organization-scoped Calculation
```typescript
// All calculations filtered by organization_id
export function calculateSectorSummary(
  sectorId: string, 
  organizationId: string
): SectorSummary

export function calculateGlobalSummary(
  organizationId: string
): GlobalSummary
```

### 3. Sector Balance (per Organization)
```
selisih_beras = total_beras_masuk - total_kebutuhan_beras
selisih_uang_lokal = total_uang_zakat_masuk - total_kebutuhan_uang_lokal
(Status calculation same as single-org)
```

---

## Services / Helpers

### Organization Service (`$lib/services/organization.ts`)
```typescript
export function getOrganizationBySlug(slug: string): Promise<Organization>
export function getUserOrganization(user: User): Promise<Organization | null>
export function createOrganization(data: NewOrganization): Promise<Organization>
export function updateOrganization(id: string, data: Partial<Organization>): Promise<void>
export function listOrganizations(): Promise<Organization[]> // Super admin only
```

### Auth Service (`$lib/auth/organization.ts`)
```typescript
export function resolveOrganizationId(locals: App.Locals, params?: RouteParams): string
export function canAccessOrganization(user: User, orgId: string): boolean
export function requireOrganizationAccess(locals: App.Locals, orgId: string): void
export function getAccessibleOrganizations(user: User): Promise<Organization[]>
```

### Calculation Service (`$lib/services/calculations.ts`)
```typescript
// All functions require organizationId
export function calculateSectorSummary(
  sectorId: string, 
  organizationId: string
): Promise<SectorSummary>

export function calculateGlobalSummary(
  organizationId: string
): Promise<GlobalSummary>

export function calculateDistributionProgress(
  organizationId: string,
  sectorId?: string
): Promise<Progress>
```

---

## Security Considerations

### 1. Data Isolation
- **CRITICAL**: Every query must include `organization_id` filter
- Use TypeScript to enforce org-scoped queries
- Review all queries in PR

### 2. Super Admin Privileges
- Super Admin can switch between organizations
- Audit log tracks which org was accessed
- UI shows organization context clearly

### 3. Cross-Organization Access Prevention
```typescript
// Middleware pattern
async function withOrganizationCheck(
  locals: App.Locals,
  orgId: string,
  callback: () => Promise<Response>
): Promise<Response> {
  if (!canAccessOrganization(locals.user, orgId)) {
    return new Response('Forbidden', { status: 403 });
  }
  return callback();
}
```

---

## Performance Optimizations

### 1. Organization-scoped Indexes
```sql
CREATE INDEX idx_muzaki_org_sector ON muzaki(organization_id, sector_id);
CREATE INDEX idx_mustahik_org_sector ON mustahik(organization_id, sector_id);
```

### 2. Query Optimization
- Always filter by `organization_id` first (most selective)
- Cache organization context in locals
- Use prepared statements for repeated queries

---

## Testing Strategy

### Unit Tests
```typescript
// Test organization isolation
describe('Organization Isolation', () => {
  it('should only return muzaki from same org', async () => {
    const result = await getMuzaki({ orgId: 'org-1' });
    expect(result.every(m => m.organization_id === 'org-1')).toBe(true);
  });
  
  it('should deny access to different org', async () => {
    const user = { role: 'admin', organization_id: 'org-1' };
    expect(canAccessOrganization(user, 'org-2')).toBe(false);
  });
});
```

### E2E Tests
- Test org switching for Super Admin
- Test data isolation between orgs
- Test permission matrix
