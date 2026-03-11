import type { LayoutServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { isSuperAdmin } from '$lib/auth/organization';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (!isSuperAdmin(locals.user)) {
		throw error(403, 'Halaman ini hanya untuk Super Admin');
	}

	return { user: locals.user };
};
