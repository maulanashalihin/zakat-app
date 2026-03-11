# Onboarding Flow - Zakat App

## Overview
Proses onboarding untuk pengguna baru yang mendaftar pertama kali. Memandu user membuat organisasi, setting zakat, dan setup data awal.

## Flow Diagram

```
User Register
    ↓
[Is there any organization?]
    ↓ NO                      ↓ YES (Super Admin only)
Onboarding Wizard           Organization Selector
    ↓
Step 1: Create Organization
    - Nama Lembaga/Masjid
    - Alamat
    - Kontak
    - Logo (optional)
    ↓
Step 2: Zakat Settings
    - Default beras per jiwa
    - Default uang per jiwa
    - Periode zakat aktif
    ↓
Step 3: Create Sectors
    - Minimal 1 sektor
    - Nama sektor
    - Warna (optional)
    ↓
Step 4: Invite Team (Optional)
    - Email petugas
    - Assign sektor
    ↓
Complete → Dashboard
```

---

## Onboarding State Tracking

### Database: onboarding_sessions
```typescript
export const onboardingSessions = sqliteTable('onboarding_sessions', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(), // One onboarding per user
  
  // Progress tracking
  current_step: integer('current_step').notNull().default(1), // 1-4
  completed_steps: text('completed_steps').default('[]'), // JSON array [1,2,3]
  is_completed: integer('is_completed', { mode: 'boolean' }).default(false),
  
  // Temporary data (saved at each step)
  temp_data: text('temp_data'), // JSON: { orgName, address, sectors: [] }
  
  // Created organization (filled at final step)
  created_organization_id: text('created_organization_id')
    .references(() => organizations.id),
  
  // Timestamps
  started_at: integer('started_at', { mode: 'number' }).$defaultFn(() => Date.now()),
  completed_at: integer('completed_at', { mode: 'number' }),
  expires_at: integer('expires_at', { mode: 'number' }) // 7 days
});
```

**Kysely Type:**
```typescript
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
}
```

---

## Routes

### Onboarding Routes
```
src/routes/
├── onboarding/                     # Onboarding wizard (protected)
│   ├── +layout.server.ts           # Check onboarding required
│   ├── +layout.svelte              # Onboarding layout (no sidebar)
│   ├── +page.server.ts             # Redirect to current step
│   │
│   ├── langkah-1/                  # Step 1: Organization
│   │   ├── +page.server.ts
│   │   └── +page.svelte
│   │
│   ├── langkah-2/                  # Step 2: Zakat Settings
│   │   ├── +page.server.ts
│   │   └── +page.svelte
│   │
│   ├── langkah-3/                  # Step 3: Sectors
│   │   ├── +page.server.ts
│   │   └── +page.svelte
│   │
│   ├── langkah-4/                  # Step 4: Invite Team
│   │   ├── +page.server.ts
│   │   └── +page.svelte
│   │
│   └── selesai/                    # Completion page
│       └── +page.svelte
```

---

## Step Details

### Step 1: Create Organization

**Fields:**
| Field | Required | Validation |
|-------|----------|------------|
| Nama Lembaga/Masjid | ✅ | Min 3 chars, unique slug auto-generate |
| Alamat | ✅ | Min 10 chars |
| No. Telepon | ❌ | Valid phone format |
| Email | ❌ | Valid email |
| Logo | ❌ | Image, max 2MB |

**API:**
```typescript
// POST /api/onboarding/step-1
{
  "name": "Masjid Al-Hidayah",
  "address": "Jl. Raya No. 123, Bandung",
  "phone": "08123456789",
  "email": "masjid@alhidayah.com",
  "logo": "<file>"
}

// Response: { success: true, tempData: { orgSlug: "masjid-al-hidayah" } }
```

---

### Step 2: Zakat Settings

**Fields:**
| Field | Required | Default |
|-------|----------|---------|
| Beras per jiwa (kg) | ✅ | 2.5 |
| Uang per jiwa (Rp) | ✅ | 40000 |
| Tahun Hijriyah | ✅ | Current year |
| Tahun Masehi | ✅ | Current year |

**API:**
```typescript
// POST /api/onboarding/step-2
{
  "default_beras_per_jiwa": 2.5,
  "default_uang_per_jiwa": 40000,
  "year_hijri": 1446,
  "year_masehi": 2025
}
```

---

### Step 3: Create Sectors

**Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| Sectors | ✅ (min 1) | Array of sector objects |
| → Nama Sektor | ✅ | Unique within org |
| → Warna | ❌ | Color picker |
| → Deskripsi | ❌ | Optional |

**UI:**
- Dynamic form: Add/remove sectors
- Minimal 1 sektor
- Suggested colors for each sector
- Preview cards

**API:**
```typescript
// POST /api/onboarding/step-3
{
  "sectors": [
    { "name": "Banjaran", "color": "#3b82f6", "description": "Wilayah Banjaran" },
    { "name": "Cangkuang", "color": "#10b981", "description": "Wilayah Cangkuang" }
  ]
}
```

---

### Step 4: Invite Team (Optional)

**Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| Team Members | ❌ | Array, can skip |
| → Nama | ✅ if adding | - |
| → Email | ✅ if adding | Valid email, unique |
| → Role | ✅ if adding | petugas / viewer |
| → Sektor | ✅ if petugas | Assign sektor |

**UI:**
- Optional step ("Lewati untuk sekarang")
- Dynamic form add/remove members
- Email validation
- Role selector

**API:**
```typescript
// POST /api/onboarding/step-4
{
  "skip": false,
  "members": [
    {
      "name": "Amirul",
      "email": "amirul@email.com",
      "role": "petugas",
      "sector_id": "sector-banjaran-id"
    }
  ]
}
```

---

## Completion

### Final Step: Create Everything

```typescript
// POST /api/onboarding/complete

// Actions:
1. Create organization
2. Create app_settings with zakat rates
3. Create period (current year)
4. Create all sectors
5. Update user:
   - organization_id = new org id
   - role = 'admin' (user becomes admin of their org)
6. Create invited users (if any)
7. Mark onboarding as completed
8. Return redirect URL: /o/{orgSlug}/dashboard
```

---

## Server Logic

### Check Onboarding Required (`hooks.server.ts`)

```typescript
// Add to hooks.server.ts
async function checkOnboarding(event: RequestEvent) {
  const user = event.locals.user;
  if (!user) return;
  
  // Skip for super_admin (they don't need org)
  if (user.role === 'super_admin') return;
  
  // Skip if user already has organization
  if (user.organization_id) return;
  
  // Check if onboarding in progress
  const onboarding = await event.locals.db
    .selectFrom('onboarding_sessions')
    .selectAll()
    .where('user_id', '=', user.id)
    .executeTakeFirst();
  
  // If no onboarding session, create one
  if (!onboarding) {
    await event.locals.db.insertInto('onboarding_sessions').values({
      id: crypto.randomUUID(),
      user_id: user.id,
      current_step: 1,
      started_at: Date.now(),
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }).execute();
    
    throw redirect(302, '/onboarding/langkah-1');
  }
  
  // If not completed, redirect to current step
  if (!onboarding.is_completed) {
    const currentPath = event.url.pathname;
    const allowedPaths = [
      '/onboarding',
      '/onboarding/langkah-1',
      '/onboarding/langkah-2',
      '/onboarding/langkah-3',
      '/onboarding/langkah-4',
      '/onboarding/selesai',
      '/api/onboarding'
    ];
    
    if (!allowedPaths.some(p => currentPath.startsWith(p))) {
      throw redirect(302, `/onboarding/langkah-${onboarding.current_step}`);
    }
  }
}
```

---

## Components

### Progress Indicator
```svelte
<!-- components/onboarding/ProgressStepper.svelte -->
<script>
  let { currentStep, completedSteps } = $props();
  
  const steps = [
    { number: 1, title: 'Organisasi', icon: Building },
    { number: 2, title: 'Zakat', icon: Settings },
    { number: 3, title: 'Sektor', icon: MapPin },
    { number: 4, title: 'Tim', icon: Users }
  ];
</script>

<div class="flex items-center justify-between mb-8">
  {#each steps as step, i}
    <div class="flex items-center">
      <div class={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        completedSteps.includes(step.number) && "bg-green-500 text-white",
        currentStep === step.number && "bg-blue-500 text-white",
        currentStep < step.number && "bg-gray-200"
      )}>
        {#if completedSteps.includes(step.number)}
          <Check size={20} />
        {:else}
          <step.icon size={20} />
        {/if}
      </div>
      <span class="ml-2 text-sm font-medium">{step.title}</span>
      {#if i < steps.length - 1}
        <div class="w-16 h-0.5 mx-4 bg-gray-200" />
      {/if}
    </div>
  {/each}
</div>
```

### Navigation Buttons
```svelte
<!-- components/onboarding/StepNavigation.svelte -->
<script>
  let { step, totalSteps, onBack, onNext, loading } = $props();
</script>

<div class="flex justify-between mt-8">
  {#if step > 1}
    <button type="button" onclick={onBack} class="btn-secondary">
      Kembali
    </button>
  {:else}
    <div /> <!-- Spacer -->
  {/if}
  
  <button type="submit" disabled={loading} class="btn-primary">
    {loading ? 'Menyimpan...' : step === totalSteps ? 'Selesai' : 'Lanjut'}
  </button>
</div>
```

---

## API Endpoints

```typescript
// src/routes/api/onboarding/

// POST /api/onboarding/step-1
// Save organization data

// POST /api/onboarding/step-2
// Save zakat settings

// POST /api/onboarding/step-3
// Save sectors

// POST /api/onboarding/step-4
// Save team invites

// POST /api/onboarding/complete
// Finalize onboarding, create all records

// GET /api/onboarding/status
// Get current onboarding status
```

---

## Error Handling

| Error | Handling |
|-------|----------|
| Validation failed | Return 400 with field errors |
| Organization name taken | Suggest alternative names |
| Session expired | Restart onboarding, preserve data if possible |
| Network error | Retry button, auto-save draft |

---

## UX Features

### 1. Auto-Save Draft
- Save temp data after each step
- Can resume if browser closed
- Show "Draft tersimpan" indicator

### 2. Skip Option
- Step 4 (Invite Team) can be skipped
- "Lewati untuk sekarang" button
- Can invite later from settings

### 3. Progress Recovery
- If user leaves and comes back
- Redirect to last completed step + 1
- Show "Lanjutkan pendaftaran" message

### 4. Help Tooltips
- Info icons with explanations
- "Apa itu sektor?" tooltip
- Example values

### 5. Preview Before Finish
- Summary page before complete
- Review all entered data
- Edit links for each section
