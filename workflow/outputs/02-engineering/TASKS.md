# Tasks - Zakat App (Multi-Organization)

## Phase 0: Multi-Organization Foundation (NEW)

### Task 0.1: Organizations Table & Core Setup
**Complexity:** High | **Estimated:** 6 hours

- [ ] 0.1.1 Create organizations table
  - Add to `src/lib/db/schema.ts`
  - Update `src/lib/db/index.ts` types
  - Generate migration
  - Apply migration

- [ ] 0.1.2 Extend users table with organization_id
  - Add `organization_id` FK to users
  - Add `role` enum (super_admin, admin, petugas, viewer)
  - Add `is_active` flag
  - Update types
  - Generate & apply migration

- [ ] 0.1.3 Create organization service
  - `src/lib/services/organization.ts`
  - CRUD operations
  - Get by slug
  - List organizations

- [ ] 0.1.4 Create organization auth helpers
  - `src/lib/auth/organization.ts`
  - `resolveOrganizationId()`
  - `canAccessOrganization()`
  - `requireOrganizationAccess()`

- [ ] 0.1.5 Update hooks.server.ts
  - Resolve organization from slug
  - Inject to locals
  - Validate access

**Files Created:**
- `src/lib/services/organization.ts`
- `src/lib/auth/organization.ts`

**Files Modified:**
- `src/lib/db/schema.ts`
- `src/lib/db/index.ts`
- `src/hooks.server.ts`

---

### Task 0.2: Super Admin Dashboard
**Complexity:** Medium | **Estimated:** 4 hours

- [ ] 0.2.1 Create (admin) layout group
  - `src/routes/(admin)/+layout.server.ts` (Super Admin guard)
  - `src/routes/(admin)/+layout.svelte`

- [ ] 0.2.2 Create Super Admin dashboard
  - `src/routes/(admin)/admin/dashboard/+page.server.ts`
  - `src/routes/(admin)/admin/dashboard/+page.svelte`
  - Stats: total orgs, total users, etc

- [ ] 0.2.3 Create organizations management page
  - `src/routes/(admin)/admin/organizations/+page.server.ts`
  - `src/routes/(admin)/admin/organizations/+page.svelte`
  - List all organizations
  - Create new organization
  - Edit organization

- [ ] 0.2.4 Create OrganizationForm component
  - `src/lib/components/forms/OrganizationForm.svelte`
  - Name, slug, address, phone, email, logo
  - Slug validation (URL-friendly)

- [ ] 0.2.5 Create organization detail/edit page
  - `src/routes/(admin)/admin/organizations/[id]/+page.server.ts`
  - `src/routes/(admin)/admin/organizations/[id]/+page.svelte`

**Files Created:**
- `src/routes/(admin)/+layout.server.ts`
- `src/routes/(admin)/+layout.svelte`
- `src/routes/(admin)/admin/dashboard/+page.server.ts`
- `src/routes/(admin)/admin/dashboard/+page.svelte`
- `src/routes/(admin)/admin/organizations/+page.server.ts`
- `src/routes/(admin)/admin/organizations/+page.svelte`
- `src/routes/(admin)/admin/organizations/[id]/+page.server.ts`
- `src/routes/(admin)/admin/organizations/[id]/+page.svelte`
- `src/lib/components/forms/OrganizationForm.svelte`

---

### Task 0.3: Organization Selector & Routing
**Complexity:** Medium | **Estimated:** 4 hours

- [ ] 0.3.1 Create organization selector page
  - `src/routes/(public)/organizations/+page.server.ts`
  - `src/routes/(public)/organizations/+page.svelte`
  - Show accessible organizations
  - Super Admin: all orgs
  - Others: only assigned org

- [ ] 0.3.2 Create (dashboard) layout with org namespace
  - `src/routes/(dashboard)/o/[orgSlug]/+layout.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/+layout.svelte`
  - Load org context
  - Verify access
  - Setup org-scoped navigation

- [ ] 0.3.3 Create OrgHeader component
  - `src/lib/components/layout/OrgHeader.svelte`
  - Organization branding
  - User menu
  - Organization switcher

- [ ] 0.3.4 Update AppSidebar with org context
  - `src/lib/components/layout/AppSidebar.svelte`
  - Organization name/logo
  - Org-scoped navigation links

- [ ] 0.3.5 Create redirect logic
  - `src/routes/(dashboard)/+page.server.ts`
  - Redirect to org selector if no org
  - Redirect to assigned org if only one

**Files Created:**
- `src/routes/(public)/organizations/+page.server.ts`
- `src/routes/(public)/organizations/+page.svelte`
- `src/routes/(dashboard)/o/[orgSlug]/+layout.server.ts`
- `src/routes/(dashboard)/o/[orgSlug]/+layout.svelte`
- `src/routes/(dashboard)/+page.server.ts`
- `src/lib/components/layout/OrgHeader.svelte`
- `src/lib/components/layout/AppSidebar.svelte`

---

### Task 0.4: Update All Tables with organization_id
**Complexity:** High | **Estimated:** 4 hours

- [ ] 0.4.1 Update sectors table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.2 Update periods table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.3 Update muzaki table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.4 Update mustahik table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.5 Update central_aid table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.6 Update distributions table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.7 Update attachments table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.8 Update audit_logs table
  - Add `organization_id` FK
  - Update schema & types

- [ ] 0.4.9 Update app_settings table
  - Add `organization_id` FK (unique)
  - Update schema & types

- [ ] 0.4.10 Generate & apply all migrations

**Files Modified:**
- `src/lib/db/schema.ts`
- `src/lib/db/index.ts`
- New migration files in `migrations/`

---

### Task 0.5: Onboarding Wizard (NEW)
**Complexity:** High | **Estimated:** 8 hours

- [ ] 0.5.1 Create onboarding_sessions table
  - Add to `src/lib/db/schema.ts`
  - user_id, current_step, completed_steps, temp_data, etc
  - Update types
  - Generate & apply migration

- [ ] 0.5.2 Create onboarding service
  - `src/lib/services/onboarding.ts`
  - `createSession()`, `getSession()`, `updateStep()`
  - `completeOnboarding()` - finalize and create all records

- [ ] 0.5.3 Create onboarding layout
  - `src/routes/onboarding/+layout.server.ts` (check onboarding required)
  - `src/routes/onboarding/+layout.svelte` (progress stepper, no sidebar)

- [ ] 0.5.4 Create Step 1: Organization
  - `src/routes/onboarding/langkah-1/+page.server.ts`
  - `src/routes/onboarding/langkah-1/+page.svelte`
  - Form: nama, alamat, phone, email, logo
  - Slug auto-generation
  - Validation: unique name

- [ ] 0.5.5 Create Step 2: Zakat Settings
  - `src/routes/onboarding/langkah-2/+page.server.ts`
  - `src/routes/onboarding/langkah-2/+page.svelte`
  - Form: beras per jiwa, uang per jiwa, periode
  - Default values with explanations

- [ ] 0.5.6 Create Step 3: Sectors
  - `src/routes/onboarding/langkah-3/+page.server.ts`
  - `src/routes/onboarding/langkah-3/+page.svelte`
  - Dynamic form: add/remove sectors
  - Minimal 1 sektor
  - Color picker
  - Suggested sector names

- [ ] 0.5.7 Create Step 4: Invite Team (Optional)
  - `src/routes/onboarding/langkah-4/+page.server.ts`
  - `src/routes/onboarding/langkah-4/+page.svelte`
  - Dynamic form: add team members
  - Fields: nama, email, role, sektor
  - "Lewati" button

- [ ] 0.5.8 Create completion page
  - `src/routes/onboarding/selesai/+page.svelte`
  - Summary of created data
  - Button to dashboard

- [ ] 0.5.9 Create onboarding API endpoints
  - `src/routes/api/onboarding/step-[1-4]/+server.ts`
  - `src/routes/api/onboarding/complete/+server.ts`
  - Save temp data at each step
  - Finalize: create org, settings, sectors, users

- [ ] 0.5.10 Create onboarding components
  - `src/lib/components/onboarding/ProgressStepper.svelte`
  - `src/lib/components/onboarding/StepNavigation.svelte`
  - `src/lib/components/onboarding/OrganizationForm.svelte`
  - `src/lib/components/onboarding/SectorCreator.svelte`
  - `src/lib/components/onboarding/TeamInvite.svelte`

- [ ] 0.5.11 Update hooks.server.ts
  - Check if user needs onboarding
  - Redirect to onboarding if no organization
  - Allow access to onboarding routes

- [ ] 0.5.12 Update register flow
  - After register, create onboarding session
  - Redirect to onboarding/langkah-1
  - Set user role to 'admin' upon completion

**Files Created:**
- `src/lib/services/onboarding.ts`
- `src/lib/components/onboarding/*.svelte`
- `src/routes/onboarding/+layout.server.ts`
- `src/routes/onboarding/+layout.svelte`
- `src/routes/onboarding/langkah-1/+page.server.ts`
- `src/routes/onboarding/langkah-1/+page.svelte`
- `src/routes/onboarding/langkah-2/+page.server.ts`
- `src/routes/onboarding/langkah-2/+page.svelte`
- `src/routes/onboarding/langkah-3/+page.server.ts`
- `src/routes/onboarding/langkah-3/+page.svelte`
- `src/routes/onboarding/langkah-4/+page.server.ts`
- `src/routes/onboarding/langkah-4/+page.svelte`
- `src/routes/onboarding/selesai/+page.svelte`
- `src/routes/api/onboarding/*/+server.ts`

**Files Modified:**
- `src/lib/db/schema.ts`
- `src/lib/db/index.ts`
- `src/hooks.server.ts`
- `src/routes/auth/register/+page.server.ts`

---

## Phase 1: Core System (Organization-Scoped)

### Task 1.1: Role-Based Access Control
**Complexity:** Medium | **Estimated:** 3 hours

- [ ] 1.1.1 Create role checking utilities
  - `src/lib/auth/roles.ts`
  - `isSuperAdmin()`, `isAdmin()`, `isPetugas()`
  - Role-based guards

- [ ] 1.1.2 Create role-based page guards
  - Helper for +page.server.ts
  - `requireRole()`, `requireAnyRole()`

- [ ] 1.1.3 Update user registration
  - Default role: viewer
  - Super Admin can create admin/petugas

---

### Task 1.2: Master Data - Sectors (Org-Scoped)
**Complexity:** Medium | **Estimated:** 3 hours

- [ ] 1.2.1 Update SectorService with org filter
  - All queries include `organization_id`
  - `createSector(orgId, data)`

- [ ] 1.2.2 Create sectors page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/master/sektor/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/master/sektor/+page.svelte`

- [ ] 1.2.3 Update SectorForm component
  - Auto-inject organization_id on create

---

### Task 1.3: Master Data - Petugas (Org-Scoped)
**Complexity:** Medium | **Estimated:** 3 hours

- [ ] 1.3.1 Create officer management (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/master/petugas/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/master/petugas/+page.svelte`
  - List users in organization
  - Assign sector to petugas

- [ ] 1.3.2 Create user invitation flow
  - Invite user by email
  - Assign role and sector
  - Auto-assign organization_id

---

### Task 1.4: Master Data - Periode (Org-Scoped)
**Complexity:** Low | **Estimated:** 2 hours

- [ ] 1.4.1 Update PeriodService with org filter
- [ ] 1.4.2 Create periods page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/master/periode/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/master/periode/+page.svelte`

---

### Task 1.5: Muzaki Management (Org-Scoped)
**Complexity:** High | **Estimated:** 6 hours

- [ ] 1.5.1 Update MuzakiService with org filter
  - `getMuzaki(orgId, filters)`
  - `createMuzaki(orgId, data)`
  - All queries filtered by org

- [ ] 1.5.2 Create MuzakiList page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/muzaki/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/muzaki/+page.svelte`
  - Auto-filter by organization_id

- [ ] 1.5.3 Create Add Muzaki page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/muzaki/tambah/+page.server.ts`
  - Auto-set organization_id

- [ ] 1.5.4 Create Edit Muzaki page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/muzaki/[id]/+page.server.ts`
  - Verify muzaki belongs to org

---

### Task 1.6: Mustahik Management (Org-Scoped)
**Complexity:** High | **Estimated:** 6 hours

- [ ] 1.6.1 Update MustahikService with org filter
- [ ] 1.6.2 Create MustahikList page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/mustahik/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/mustahik/+page.svelte`
- [ ] 1.6.3 Create Add/Edit Mustahik pages (org-scoped)
  - Auto-filter sectors by org
  - Auto-set organization_id

---

### Task 1.7: Calculation Service (Org-Scoped)
**Complexity:** High | **Estimated:** 5 hours

- [ ] 1.7.1 Update CalculationService
  - `calculateSectorSummary(orgId, sectorId)`
  - `calculateGlobalSummary(orgId)`
  - All calculations filtered by org

- [ ] 1.7.2 Write unit tests
  - Test org isolation in calculations

---

### Task 1.8: Dashboard Main (Org-Scoped)
**Complexity:** Medium | **Estimated:** 5 hours

- [ ] 1.8.1 Create dashboard page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/dashboard/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/dashboard/+page.svelte`
  - Load org context from parent
  - Calculate stats for specific org

- [ ] 1.8.2 Update dashboard components
  - Accept organization prop
  - Display org branding

---

### Task 1.9: Rekap Per Sektor (Org-Scoped)
**Complexity:** High | **Estimated:** 4 hours

- [ ] 1.9.1 Create rekap sektor page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/sektor/+page.server.ts`
  - `src/routes/(dashboard)/o/[orgSlug]/sektor/+page.svelte`
  - Only show sectors from this org

- [ ] 1.9.2 Create sector detail page (org-scoped)
  - `src/routes/(dashboard)/o/[orgSlug]/sektor/[id]/+page.server.ts`
  - Verify sector belongs to org

---

## Phase 2: Extended Features

### Task 2.1: Bantuan Pusat (Org-Scoped)
**Complexity:** Medium | **Estimated:** 4 hours

- [ ] 2.1.1 Update CentralAidService with org filter
- [ ] 2.1.2 Create management page (org-scoped)

### Task 2.2: Distribusi Module (Org-Scoped)
**Complexity:** High | **Estimated:** 6 hours

- [ ] 2.2.1 Update DistributionService with org filter
- [ ] 2.2.2 Create distribusi page (org-scoped)

### Task 2.3: Laporan & Export (Org-Scoped)
**Complexity:** Medium | **Estimated:** 4 hours

- [ ] 2.3.1 Update ExportService with org filter
- [ ] 2.3.2 Create laporan page (org-scoped)

### Task 2.4: Grafik Dashboard (Org-Scoped)
**Complexity:** Medium | **Estimated:** 4 hours

- [ ] 2.4.1 Create chart components
- [ ] 2.4.2 Data filtered by organization

---

## Phase 3: Advanced Features

### Task 3.1: Audit Log (Org-Scoped)
**Complexity:** Medium | **Estimated:** 3 hours

- [ ] 3.1.1 Update AuditService with org filter
- [ ] 3.1.2 Log organization_id in all actions
- [ ] 3.1.3 Create audit log page (org-scoped)

### Task 3.2: Import Spreadsheet (Org-Scoped)
**Complexity:** High | **Estimated:** 5 hours

- [ ] 3.2.1 CSV parser service
- [ ] 3.2.2 Import with organization_id assignment

### Task 3.3: App Settings (Org-Scoped)
**Complexity:** Low | **Estimated:** 2 hours

- [ ] 3.3.1 Create settings page (org-scoped)
- [ ] 3.3.2 Per-organization zakat rates

---

## Summary

| Phase | Tasks | Est. Hours | Focus |
|-------|-------|------------|-------|
| **Phase 0** | 4 | 18 | Multi-Org Foundation |
| **Phase 1** | 9 | 37 | Core Zakat System |
| **Phase 2** | 4 | 18 | Extended Features |
| **Phase 3** | 3 | 10 | Advanced Features |
| **Total** | **20** | **83** | |

**Recommended Sprint:**
- **Sprint 0**: Phase 0 (Multi-Org foundation) - 18 jam
- **Sprint 1**: Phase 1.1 - 1.4 (Auth, Master Data) - 11 jam
- **Sprint 2**: Phase 1.5 - 1.6 (Muzaki, Mustahik) - 12 jam
- **Sprint 3**: Phase 1.7 - 1.9 (Calculation, Dashboard, Rekap) - 14 jam
- **Sprint 4**: Phase 2 (Extended) - 18 jam
- **Sprint 5**: Phase 3 (Advanced) - 10 jam
