import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is already logged in, redirect to appropriate dashboard
	if (locals.user) {
		// ⭐ Super admin goes to admin dashboard
		if (locals.user.globalRole === 'super_admin') {
			throw redirect(302, '/admin/dashboard');
		}

		// ⭐ User with organization membership goes to their org dashboard
		if (locals.user.currentOrganizationId) {
			throw redirect(302, `/o/${locals.user.currentOrganizationId}/dashboard`);
		}

		// User without organization goes to onboarding to create one
		throw redirect(302, '/onboarding/langkah-1');
	}

	// Not logged in - show landing page
	return {};
};
