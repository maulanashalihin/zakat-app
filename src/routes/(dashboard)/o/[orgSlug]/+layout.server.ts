import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { canAccessOrganization, requireOrganizationAccess } from '$lib/auth/organization';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { orgSlug } = params;

	// Get organization by slug
	const organization = await locals.db
		.selectFrom('organizations')
		.select(['id', 'name', 'slug', 'logo_url', 'is_active'])
		.where('slug', '=', orgSlug)
		.executeTakeFirst();

	if (!organization) {
		throw error(404, 'Organisasi tidak ditemukan');
	}

	// Check access
	if (!canAccessOrganization(locals.user, organization.id)) {
		throw error(403, 'Akses ditolak ke organisasi ini');
	}

	// ✅ OPTIMIZED: Only load sectors for specific pages that need them
	// Sectors will be loaded on-demand in pages that need them (sektor, muzaki, mustahik)
	// This avoids unnecessary query on every page load
	
	// ✅ OPTIMIZED: Load settings with proper column selection
	const settings = await locals.db
		.selectFrom('app_settings')
		.select(['default_beras_per_jiwa', 'default_uang_per_jiwa', 'active_period_id'])
		.where('organization_id', '=', organization.id)
		.executeTakeFirst();

	return {
		organization,
		sectors: [], // Load on-demand in pages that need it
		settings: settings || {
			default_beras_per_jiwa: 2.5,
			default_uang_per_jiwa: 40000,
			active_period_id: null
		},
		user: locals.user
	};
};
