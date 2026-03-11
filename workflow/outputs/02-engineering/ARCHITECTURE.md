# Architecture - Zakat App (Multi-Organization)

## Multi-Organization Concept

```
┌─────────────────────────────────────────────────────────┐
│                    ZAKAT APP PLATFORM                    │
├─────────────────────────────────────────────────────────┤
│  Super Admin                                             │
│  └── Can manage ALL organizations                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Organization │  │ Organization │  │ Organization │     │
│  │  Masjid A    │  │  Masjid B    │  │  Masjid C    │     │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤     │
│  │ • Admin      │  │ • Admin      │  │ • Admin      │     │
│  │ • Petugas    │  │ • Petugas    │  │ • Petugas    │     │
│  │ • Muzaki     │  │ • Muzaki     │  │ • Muzaki     │     │
│  │ • Mustahik   │  │ • Mustahik   │  │ • Mustahik   │     │
│  │ • Sectors    │  │ • Sectors    │  │ • Sectors    │     │
│  │ • Settings   │  │ • Settings   │  │ • Settings   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── lib/
│   ├── auth/
│   │   ├── session.ts          # Existing session management
│   │   ├── roles.ts            # Role checking functions
│   │   └── organization.ts     # ⭐ NEW: Organization context
│   ├── db/
│   │   ├── schema.ts           # Extended with organizations
│   │   └── index.ts            # Types extended
│   ├── components/
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── forms/              # Form components
│   │   ├── tables/             # Table components
│   │   ├── layout/             # Layout components
│   │   │   ├── AppSidebar.svelte
│   │   │   ├── OrgHeader.svelte
│   │   │   └── OrgSelector.svelte
│   │   └── ui/                 # UI helpers
│   ├── services/               # Business logic
│   │   ├── organization.ts     # ⭐ NEW: Organization service
│   │   ├── calculations.ts     # Rekap calculations
│   │   ├── validation.ts       # Input validation
│   │   └── export.ts           # Export functions
│   ├── stores/                 # Svelte stores
│   │   ├── dashboard.svelte.ts
│   │   ├── filters.svelte.ts
│   │   └── organization.svelte.ts  # ⭐ NEW: Org context store
│   └── utils/                  # Helpers
│       ├── formatters.ts
│       └── constants.ts
├── routes/
│   ├── (public)/               # Public routes
│   │   ├── +page.svelte        # Landing
│   │   ├── login/
│   │   ├── register/
│   │   └── organizations/      # Organization selector
│   ├── (admin)/                # Super Admin routes
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── organizations/  # Manage all orgs
│   │   │   └── users/          # Manage all users
│   │   └── o/[orgSlug]/        # Access org as Super Admin
│   └── (dashboard)/            # Organization-scoped routes
│       ├── o/[orgSlug]/         # ⭐ ORGANIZATION NAMESPACE
│       │   ├── +layout.svelte   # Org layout
│       │   ├── +layout.server.ts
│       │   ├── dashboard/
│       │   ├── muzaki/
│       │   ├── mustahik/
│       │   ├── distribusi/
│       │   ├── sektor/
│       │   ├── laporan/
│       │   ├── master/
│       │   └── audit-log/
│       └── +page.server.ts     # Redirect to org selector
└── app.css
```

---

## System Layers

### 1. Organization Layer (NEW)
```
┌────────────────────────────────────────┐
│      Organization Context Layer        │
├────────────────────────────────────────┤
│  • Organization resolution             │
│  • Access control by org               │
│  • Data isolation enforcement          │
└────────────────────────────────────────┘
```

**Key Functions:**
- `resolveOrganizationId()` - Get current org from params or user
- `canAccessOrganization()` - Check if user can access org
- `requireOrganizationAccess()` - Guard for org-scoped routes

### 2. Presentation Layer
- **Svelte Components**: UI rendering
- **Form Actions**: Server-side form handling
- **API Routes**: JSON endpoints

### 3. Business Logic Layer
- **Services**: Organization, Calculation, Validation, Export
- **Stores**: Reactive state management
- **Helpers**: Formatters, constants

### 4. Data Access Layer
- **Kysely Queries**: Database operations
- **Organization Filter**: MANDATORY on all queries

---

## Data Flow

### Multi-Organization Request Flow
```
Request: /o/masjid-alhidayah/dashboard
    ↓
hooks.server.ts (auth check)
    ↓
(o)/o/[orgSlug]/+layout.server.ts
    ├─ Resolve organization by slug
    ├─ Verify user access to org
    ├─ Load org context (sectors, settings)
    ↓
(o)/o/[orgSlug]/dashboard/+page.server.ts
    ├─ Get org from parent layout
    ├─ Query data with organization_id filter
    ↓
+page.svelte (render with org context)
```

### Organization Context Resolution
```typescript
// 1. Extract orgSlug from URL: /o/masjid-alhidayah/dashboard
const { orgSlug } = params;

// 2. Lookup organization
const organization = await db
  .selectFrom('organizations')
  .where('slug', '=', orgSlug)
  .executeTakeFirst();

// 3. Verify access
if (!canAccessOrganization(user, organization.id)) {
  throw error(403, 'Access denied');
}

// 4. All queries filtered by org
const data = await db
  .selectFrom('muzaki')
  .where('organization_id', '=', organization.id) // ⭐
  .execute();
```

---

## Module Dependencies

### Organization Module
```
lib/services/organization.ts
├── lib/db/index.ts (types)
├── lib/auth/organization.ts (auth)
└── used by:
    ├── routes/(admin)/admin/organizations/
    └── routes/(dashboard)/o/[orgSlug]/+layout.server.ts
```

### Dashboard Module (per Organization)
```
routes/o/[orgSlug]/dashboard/
├── services/calculations.ts (with org filter)
├── components/dashboard/
└── +page.server.ts (loads org from parent)
```

### Muzaki Module (per Organization)
```
routes/o/[orgSlug]/muzaki/
├── services/validation.ts
├── services/muzaki.ts (with org filter)
├── components/forms/MuzakiForm.svelte
└── +page.server.ts (org-scoped queries)
```

---

## Data Isolation Patterns

### Pattern 1: Organization-Scoped Query Helper
```typescript
// src/lib/services/base.ts
export function createOrgQuery<T extends keyof Database>(
  db: Kysely<Database>,
  table: T,
  orgId: string
) {
  return db.selectFrom(table).where('organization_id', '=', orgId);
}

// Usage:
const muzaki = await createOrgQuery(locals.db, 'muzaki', orgId)
  .selectAll()
  .execute();
```

### Pattern 2: Organization Service
```typescript
// src/lib/services/organization.ts
export class OrganizationService {
  constructor(private db: Kysely<Database>) {}
  
  async getMuzaki(orgId: string, filters?: Filters) {
    let query = this.db
      .selectFrom('muzaki')
      .where('organization_id', '=', orgId);
    
    if (filters?.sectorId) {
      query = query.where('sector_id', '=', filters.sectorId);
    }
    
    return query.execute();
  }
  
  async createMuzaki(orgId: string, data: NewMuzaki) {
    return this.db.insertInto('muzaki').values({
      ...data,
      organization_id: orgId // Auto-inject
    }).execute();
  }
}
```

### Pattern 3: Hook-based Organization Injection
```typescript
// src/hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {
  // ... existing auth ...
  
  // If URL has orgSlug, resolve and validate
  const orgSlug = event.params.orgSlug;
  if (orgSlug && event.locals.user) {
    const org = await getOrganizationBySlug(orgSlug);
    if (!canAccessOrganization(event.locals.user, org.id)) {
      throw redirect(302, '/organizations');
    }
    event.locals.organization = org; // Inject to locals
  }
  
  return resolve(event);
};
```

---

## Security Architecture

### Data Isolation Checklist
- [ ] Every query includes `organization_id` filter
- [ ] Every insert includes `organization_id` value
- [ ] Super Admin access is explicitly checked
- [ ] Organization slug is validated before use
- [ ] Cross-org data access returns 403

### Security Flow
```
User Request
    ↓
Auth Check (session valid?)
    ↓
Organization Resolution (from slug or user)
    ↓
Access Control (can user access this org?)
    ↓
Data Query (filtered by org_id)
    ↓
Response
```

---

## Component Architecture

### Organization Context Components
```
components/layout/
├── AppSidebar.svelte         # Navigation with org menu
├── OrgHeader.svelte          # Header with org branding
├── OrgSelector.svelte        # Organization switcher
├── OrgBadge.svelte           # Current org indicator
└── AccessDenied.svelte       # 403 error display
```

### Page Components (Organization-aware)
```svelte
<!-- All pages receive organization from layout -->
<script>
  let { data } = $props();
  // data.organization - current org context
  // data.user - current user
  // data.* - page-specific data
</script>
```

---

## Constants

```typescript
// utils/constants.ts
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',    // Platform admin
  ADMIN: 'admin',                 // Organization admin
  PETUGAS: 'petugas',             // Organization officer
  VIEWER: 'viewer'                // Read-only access
} as const;

export const ORGANIZATION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium'
} as const;

export const DEFAULT_ZAKAT_RATES = {
  beras: 2.5,    // kg per jiwa
  uang: 40000    // rupiah per jiwa
};
```

---

## Route Guards

### Organization Layout Guard
```typescript
// (dashboard)/o/[orgSlug]/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals, params }) => {
  if (!locals.user) throw redirect(302, '/login');
  
  const organization = await getOrganizationBySlug(params.orgSlug);
  if (!organization) throw error(404, 'Organization not found');
  
  if (!canAccessOrganization(locals.user, organization.id)) {
    throw error(403, 'Access denied');
  }
  
  return { organization };
};
```

### Super Admin Guard
```typescript
// (admin)/admin/+layout.server.ts
export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.user?.role !== 'super_admin') {
    throw redirect(302, '/login');
  }
  return {};
};
```

---

## Database Index Strategy

### Organization-scoped Indexes (for performance)
```sql
-- Primary lookup indexes
CREATE INDEX idx_muzaki_org ON muzaki(organization_id);
CREATE INDEX idx_mustahik_org ON mustahik(organization_id);
CREATE INDEX idx_sectors_org ON sectors(organization_id);

-- Compound indexes for common queries
CREATE INDEX idx_muzaki_org_sector ON muzaki(organization_id, sector_id);
CREATE INDEX idx_mustahik_org_sector ON mustahik(organization_id, sector_id);
CREATE INDEX idx_muzaki_org_created ON muzaki(organization_id, created_at);

-- Unique constraints
CREATE UNIQUE INDEX idx_org_slug ON organizations(slug);
CREATE UNIQUE INDEX idx_sectors_org_name ON sectors(organization_id, name);
```

---

## Deployment Considerations

### Single Database, Multiple Organizations
- All orgs share one D1 database
- Isolation via `organization_id` column
- No schema separation needed

### Scalability
- Index on `organization_id` for query performance
- Consider pagination for large orgs
- Dashboard caching per organization

### Backup/Restore
- Can backup/restore per organization using `organization_id` filter
- Export org data to CSV for migration
