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
		.selectAll()
		.where('slug', '=', orgSlug)
		.executeTakeFirst();

	if (!organization) {
		throw error(404, 'Organisasi tidak ditemukan');
	}

	// Check access
	if (!canAccessOrganization(locals.user, organization.id)) {
		throw error(403, 'Akses ditolak ke organisasi ini');
	}

	// Load sectors
	const sectors = await locals.db
		.selectFrom('sectors')
		.select(['id', 'name', 'color', 'description'])
		.where('organization_id', '=', organization.id)
		.where('is_active', '=', 1)
		.orderBy('name')
		.execute();

	// Load settings
	const settings = await locals.db
		.selectFrom('app_settings')
		.select(['default_beras_per_jiwa', 'default_uang_per_jiwa', 'active_period_id'])
		.where('organization_id', '=', organization.id)
		.executeTakeFirst();

	return {
		organization,
		sectors,
		settings: settings || {
			default_beras_per_jiwa: 2.5,
			default_uang_per_jiwa: 40000,
			active_period_id: null
		},
		user: locals.user
	};
};
