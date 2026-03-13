# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LayangKit (zakat-app) is a multi-organization zakat (Islamic alms) management system built with SvelteKit and deployed on Cloudflare's edge network. It supports multiple organizations with many-to-many user memberships, allowing users to manage zakat collection (muzaki) and distribution (mustahik) across different sectors and periods.

## Development Commands

```bash
# Development
npm run dev                  # Start dev server (Vite) at localhost:5173
npm run check                # Type-check with svelte-check

# Building & Deployment
npm run build                # Build for Cloudflare Pages
npm run preview              # Preview production build locally
npm run deploy               # Deploy to Cloudflare Pages

# Database (Cloudflare D1)
npm run db:generate          # Generate migrations from schema.ts changes
npm run db:migrate:local     # Apply migrations to local D1
npm run db:migrate           # Apply migrations to production D1
npm run db:refresh:local     # Reset local DB + reapply migrations
npm run db:seed:local        # Seed local database

# Testing
npm run test                 # Run unit tests (Vitest)
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage
npm run test:e2e             # Run E2E tests (Playwright)
npm run test:e2e:ui          # Run E2E tests with UI

# Cloudflare
npm run cf:typegen           # Generate Cloudflare Workers types
npm run logs                 # View production logs (real-time)
```

## Architecture

### Database Layer (Hybrid Approach)

The project uses a **hybrid ORM approach**:
- **Drizzle ORM** for schema definitions (`src/lib/db/schema.ts`)
- **Kysely** for actual database queries (type-safe SQL builder)

Key files:
- `src/lib/db/schema.ts` - Drizzle schema with camelCase column names
- `src/lib/db/index.ts` - Kysely `Database` interface with snake_case column names (conversion from Drizzle)
- `src/hooks.server.ts` - Initializes Kysely instance from D1 binding

When adding new tables:
1. Define table in `schema.ts` using Drizzle
2. Add corresponding type to `Database` interface in `index.ts` with snake_case keys
3. Run `npm run db:generate` to create migration
4. Run `npm run db:migrate:local` to apply

### Multi-Organization System

Users can belong to multiple organizations through `organization_members` table (many-to-many):
- **Global roles**: `super_admin` (platform-wide admin)
- **Organization roles**: `admin`, `petugas` (officer), `viewer` (per-org)
- Routes use `/o/[orgSlug]/...` pattern for organization-scoped pages
- Session user object includes `memberships` array with all org memberships

Route groups:
- `(admin)/` - Super admin routes (`/admin/...`)
- `(dashboard)/` - Authenticated user routes
- `(public)/` - Public pages

### Authentication

Custom session-based auth (Lucia-style):
- Sessions stored in `sessions` table with HTTP-only cookies
- Password hashing via Web Crypto API (PBKDF2)
- Google OAuth via Arctic
- Email verification via Resend

Key auth files:
- `src/lib/auth/session.ts` - Session management, user type definitions
- `src/lib/auth/password.ts` - PBKDF2 password hashing
- `src/lib/auth/google.ts` - Google OAuth flow
- `src/hooks.server.ts` - Session validation on every request

### Route Patterns

**Server Load Functions** - Query directly from database, no API layer:
```typescript
export const load: PageServerLoad = async ({ locals, params }) => {
  const data = await locals.db
    .selectFrom('table')
    .where('organization_id', '=', params.orgId)
    .execute();
  return { data };
};
```

**Form Actions** - Handle mutations:
```typescript
export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    // Validate with Zod, process, return result
    return { success: true };
  }
};
```

### Service Classes

Business logic encapsulated in service classes (e.g., `OrganizationService`):
- Instantiated with `Kysely<Database>` instance
- Located in `src/lib/services/`

### Environment

- **Runtime**: Cloudflare Workers (edge)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend
- Bindings configured in `wrangler.toml`
- Secrets in `.env` (local) or Cloudflare Dashboard (production)

### Key Type Conventions

- Drizzle schema: camelCase (`passwordHash`, `createdAt`)
- Kysely types: snake_case (`password_hash`, `created_at`)
- Session user: `SessionUser` type with memberships array
- Database access: `locals.db` (Kysely instance)

## Testing

### Unit Tests (Vitest)
- Located in `tests/unit/`
- Mock setup in `tests/unit/setup.ts`
- SvelteKit modules mocked via aliases in `vitest.config.ts`
- Some auth tests excluded due to SvelteKit module dependencies

### E2E Tests (Playwright)
- Located in `tests/e2e/`
- Auto-starts dev server
- Tests run against `localhost:5173`

## Common Patterns

### Organization Access Control
```typescript
// Check if user has access to organization
const hasAccess = user.memberships.some(m =>
  m.organizationSlug === orgSlug && m.isActive
);

// Check role
if (!['admin', 'petugas'].includes(user.currentRole)) {
  throw error(403, 'Unauthorized');
}
```

### Query with Organization Scope
```typescript
const data = await locals.db
  .selectFrom('muzaki')
  .where('organization_id', '=', organizationId)
  .orderBy('created_at', 'desc')
  .execute();
```

## Project-Specific Domain

- **Muzaki**: Zakat payers (people who pay zakat)
- **Mustahik**: Zakat recipients (8 categories: fakir, miskin, amil, mualaf, riqab, gharim, fisabilillah, ibnu_sabil)
- **Sektor**: Geographic sectors/areas within an organization
- **Periode**: Zakat collection period (Hijri/Masehi year)
- **Petugas**: Officers who collect/distribute zakat
