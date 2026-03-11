# Routes - Zakat App (Multi-Organization)

## Route Structure

```
src/routes/
├── (public)/                       # Public routes
│   ├── +page.svelte                # Landing page
│   ├── login/                      # Login page
│   ├── register/                   # Register (Super Admin only)
│   └── organizations/              # Organization selector
│       └── +page.svelte
│
├── (admin)/                        # Super Admin routes
│   ├── +layout.server.ts           # Super Admin guard
│   ├── admin/
│   │   ├── dashboard/              # Super Admin dashboard
│   │   ├── organizations/          # Manage organizations
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   └── [id]/               # Edit organization
│   │   │       ├── +page.svelte
│   │   │       └── +page.server.ts
│   │   └── users/                  # Manage all users
│   │       ├── +page.svelte
│   │       └── +page.server.ts
│   └── o/[orgSlug]/                # Access specific org as Super Admin
│       └── +layout.server.ts       # Redirect to org dashboard
│
├── (dashboard)/                    # Organization-scoped routes
│   ├── +layout.server.ts           # Auth + Organization context
│   ├── o/[orgSlug]/                # Organization namespace
│   │   ├── +layout.svelte          # Org layout with sidebar
│   │   ├── +layout.server.ts       # Load org context
│   │   ├── dashboard/              # Main dashboard
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── muzaki/                 # Muzaki management
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   ├── +server.ts
│   │   │   └── tambah/
│   │   │       ├── +page.svelte
│   │   │       └── +page.server.ts
│   │   ├── muzaki/[id]/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── mustahik/               # Mustahik management
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   └── tambah/
│   │   ├── mustahik/[id]/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── distribusi/             # Distribution module
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── sektor/                 # Rekap per sektor
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   └── [id]/
│   │   ├── laporan/                # Reports
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   ├── master/                 # Master data
│   │   │   ├── +page.svelte
│   │   │   ├── sektor/
│   │   │   ├── petugas/
│   │   │   ├── periode/
│   │   │   └── pengaturan/
│   │   └── audit-log/              # Audit trail
│   │       ├── +page.svelte
│   │       └── +page.server.ts
│   └── +page.server.ts             # Redirect to org selector or dashboard
│
└── api/                            # Shared API
    ├── export/
    │   └── [type]/+server.ts
    └── organizations/
        └── +server.ts              # API for org management
```

---

## Route Table

### Public Routes

| URL | Files | Description |
|-----|-------|-------------|
| `/` | +page.svelte | Landing page with org selector or login |
| `/login` | +page.svelte, +page.server.ts | Login form |
| `/register` | +page.svelte, +page.server.ts | Super Admin registration |
| `/organizations` | +page.svelte | Organization selector (post-login) |

### Super Admin Routes

| URL | Files | Description |
|-----|-------|-------------|
| `/admin/dashboard` | +page.svelte, +page.server.ts | Super Admin dashboard |
| `/admin/organizations` | +page.svelte, +page.server.ts | List all organizations |
| `/admin/organizations/[id]` | +page.svelte, +page.server.ts | Edit organization |
| `/admin/users` | +page.svelte, +page.server.ts | Manage all users |
| `/o/[orgSlug]/*` | redirects | Redirect to org dashboard |

### Organization-Scoped Routes (Require orgSlug)

| URL | Files | Role | Description |
|-----|-------|------|-------------|
| `/o/[orgSlug]/dashboard` | +page.server.ts, +page.svelte | All* | Org dashboard |
| `/o/[orgSlug]/muzaki` | +page.server.ts, +page.svelte, +server.ts | All* | Muzaki list |
| `/o/[orgSlug]/muzaki/tambah` | +page.server.ts, +page.svelte | Admin, Petugas | Add muzaki |
| `/o/[orgSlug]/muzaki/[id]` | +page.server.ts, +page.svelte | Admin, Petugas** | Edit muzaki |
| `/o/[orgSlug]/mustahik` | +page.server.ts, +page.svelte | All* | Mustahik list |
| `/o/[orgSlug]/mustahik/tambah` | +page.server.ts, +page.svelte | Admin | Add mustahik |
| `/o/[orgSlug]/distribusi` | +page.server.ts, +page.svelte | All* | Distribution |
| `/o/[orgSlug]/sektor` | +page.server.ts, +page.svelte | All | Sector summary |
| `/o/[orgSlug]/laporan` | +page.server.ts, +page.svelte | All | Reports |
| `/o/[orgSlug]/master/*` | various | Admin | Master data |
| `/o/[orgSlug]/audit-log` | +page.server.ts, +page.svelte | Admin | Audit log |

**Role Notes:**
- `All*` = Petugas restricted to their assigned sector
- `Petugas**` = Can only edit their own input

---

## Route Details

### Organization Layout (`(dashboard)/o/[orgSlug]/+layout.server.ts`)

```typescript
import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { canAccessOrganization } from '$lib/auth/organization';

export const load: LayoutServerLoad = async ({ locals, params }) => {
  // 1. Check auth
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // 2. Get organization by slug
  const organization = await locals.db
    .selectFrom('organizations')
    .selectAll()
    .where('slug', '=', params.orgSlug)
    .executeTakeFirst();
  
  if (!organization) {
    throw error(404, 'Organization not found');
  }
  
  // 3. Verify access
  if (!canAccessOrganization(locals.user, organization.id)) {
    throw error(403, 'Access denied to this organization');
  }
  
  // 4. Load organization context
  const sectors = await locals.db
    .selectFrom('sectors')
    .selectAll()
    .where('organization_id', '=', organization.id)
    .execute();
  
  const settings = await locals.db
    .selectFrom('app_settings')
    .selectAll()
    .where('organization_id', '=', organization.id)
    .executeTakeFirst();
  
  return { 
    organization, 
    sectors, 
    settings,
    user: locals.user 
  };
};
```

### Organization Layout Component (`(dashboard)/o/[orgSlug]/+layout.svelte`)

```svelte
<script>
  let { data, children } = $props();
  
  import AppSidebar from '$lib/components/layout/AppSidebar.svelte';
  import OrgHeader from '$lib/components/layout/OrgHeader.svelte';
</script>

<div class="flex h-screen">
  <!-- Sidebar with org context -->
  <AppSidebar 
    organization={data.organization}
    sectors={data.sectors}
    user={data.user}
  />
  
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header with org branding -->
    <OrgHeader 
      organization={data.organization}
      user={data.user}
    />
    
    <!-- Main content -->
    <main class="flex-1 overflow-auto p-6">
      {@render children()}
    </main>
  </div>
</div>
```

---

### Dashboard Route (`o/[orgSlug]/dashboard/+page.server.ts`)

```typescript
import type { PageServerLoad } from './$types';
import { calculateGlobalSummary } from '$lib/services/calculations';

export const load: PageServerLoad = async ({ parent, locals }) => {
  // Get organization from parent layout
  const { organization, user } = await parent();
  
  // Calculate dashboard data for this org
  const summary = await calculateGlobalSummary(locals.db, organization.id);
  
  // Petugas: filter to their sector
  const sectorFilter = user.role === 'petugas' ? user.sector_id : null;
  
  return { summary, sectorFilter };
};
```

---

### Muzaki List (`o/[orgSlug]/muzaki/+page.server.ts`)

```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals, url }) => {
  const { organization, user } = await parent();
  
  // Parse filters
  const sectorId = url.searchParams.get('sector');
  const search = url.searchParams.get('search');
  
  // Build query - MANDATORY org filter
  let query = locals.db
    .selectFrom('muzaki')
    .selectAll()
    .where('organization_id', '=', organization.id);
  
  // Petugas restriction
  if (user.role === 'petugas') {
    query = query.where('sector_id', '=', user.sector_id);
  } else if (sectorId) {
    query = query.where('sector_id', '=', sectorId);
  }
  
  if (search) {
    query = query.where('name', 'like', `%${search}%`);
  }
  
  const muzaki = await query.orderBy('created_at', 'desc').execute();
  
  return { muzaki };
};
```

---

### Muzaki Create (`o/[orgSlug]/muzaki/tambah/+page.server.ts`)

```typescript
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  create: async ({ request, locals, params }) => {
    const { organization } = await parent(); // Get from layout
    
    // Verify permission
    if (!['admin', 'petugas'].includes(locals.user.role)) {
      return fail(403, { error: 'Unauthorized' });
    }
    
    const form = await request.formData();
    
    // Insert dengan organization_id
    await locals.db.insertInto('muzaki').values({
      id: crypto.randomUUID(),
      organization_id: organization.id, // ⭐ MANDATORY
      name: form.get('name'),
      address: form.get('address'),
      sector_id: form.get('sectorId'),
      // ... other fields
      created_at: Date.now()
    }).execute();
    
    throw redirect(303, `/o/${params.orgSlug}/muzaki?success=true`);
  }
};
```

---

### Super Admin Organizations List (`admin/organizations/+page.server.ts`)

```typescript
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Only Super Admin
  if (!locals.user || locals.user.role !== 'super_admin') {
    throw redirect(302, '/login');
  }
  
  const organizations = await locals.db
    .selectFrom('organizations')
    .selectAll()
    .orderBy('created_at', 'desc')
    .execute();
  
  // Get stats per org
  const orgStats = await Promise.all(
    organizations.map(async (org) => {
      const muzakiCount = await locals.db
        .selectFrom('muzaki')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', org.id)
        .executeTakeFirst();
      
      const userCount = await locals.db
        .selectFrom('users')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', org.id)
        .executeTakeFirst();
      
      return { ...org, muzakiCount: Number(muzakiCount?.count), userCount: Number(userCount?.count) };
    })
  );
  
  return { organizations: orgStats };
};
```

---

### API Routes

**Organization API** (`api/organizations/+server.ts`)

```typescript
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

// GET /api/organizations - List all (Super Admin only)
export const GET: RequestHandler = async ({ locals }) => {
  if (locals.user?.role !== 'super_admin') {
    throw error(403, 'Forbidden');
  }
  
  const organizations = await locals.db
    .selectFrom('organizations')
    .select(['id', 'name', 'slug', 'is_active'])
    .execute();
  
  return json({ organizations });
};

// POST /api/organizations - Create new org (Super Admin)
export const POST: RequestHandler = async ({ request, locals }) => {
  if (locals.user?.role !== 'super_admin') {
    throw error(403, 'Forbidden');
  }
  
  const body = await request.json();
  
  const id = crypto.randomUUID();
  await locals.db.insertInto('organizations').values({
    id,
    name: body.name,
    slug: body.slug,
    address: body.address,
    phone: body.phone,
    email: body.email,
    created_at: Date.now()
  }).execute();
  
  // Create default settings
  await locals.db.insertInto('app_settings').values({
    id: crypto.randomUUID(),
    organization_id: id,
    default_beras_per_jiwa: 2.5,
    default_uang_per_jiwa: 40000
  }).execute();
  
  return json({ success: true, id }, { status: 201 });
};
```

---

## Navigation Structure

### Super Admin Sidebar
```
Super Admin
├── Dashboard (/admin/dashboard)
├── Organizations (/admin/organizations)
├── All Users (/admin/users)
└── Settings
```

### Organization Sidebar
```
[ORGANIZATION NAME]
Dashboard
├── Dashboard (/o/[slug]/dashboard)
Data Management
├── Muzaki (/o/[slug]/muzaki)
├── Mustahik (/o/[slug]/mustahik)
├── Distribusi (/o/[slug]/distribusi)
Reports
├── Rekap Sektor (/o/[slug]/sektor)
├── Laporan (/o/[slug]/laporan)
Master Data
├── Master Sektor (/o/[slug]/master/sektor)
├── Master Petugas (/o/[slug]/master/petugas)
├── Master Periode (/o/[slug]/master/periode)
└── Pengaturan (/o/[slug]/master/pengaturan)
System
├── Audit Log (/o/[slug]/audit-log)
└── [Switch Org] → /organizations
```

---

## Organization Selector

**Page:** `/organizations/+page.svelte`

```svelte
<script>
  let { data } = $props();
  
  // Show accessible organizations
  // - Super Admin: all organizations
  // - Others: only their assigned org
</script>

<div class="max-w-4xl mx-auto p-8">
  <h1 class="text-2xl font-bold mb-6">Pilih Lembaga/Masjid</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each data.organizations as org}
      <a 
        href="/o/{org.slug}/dashboard"
        class="card hover:shadow-lg transition-shadow"
      >
        {#if org.logo_url}
          <img src={org.logo_url} alt={org.name} class="w-16 h-16 mb-4" />
        {/if}
        <h2 class="text-lg font-semibold">{org.name}</h2>
        <p class="text-slate-600">{org.address || '-'}</p>
        <span class="text-sm text-slate-500">
          {org.muzakiCount} muzaki • {org.userCount} petugas
        </span>
      </a>
    {/each}
  </div>
  
  {#if data.user.role === 'super_admin'}
    <a href="/admin/organizations" class="btn-primary mt-6">
      + Kelola Organisasi
    </a>
  {/if}
</div>
```
