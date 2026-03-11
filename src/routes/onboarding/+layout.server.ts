import type { LayoutServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { getOnboardingSession } from '$lib/services/onboarding';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Must be authenticated
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Super admin doesn't need onboarding
	if (locals.user.role === 'super_admin') {
		throw redirect(302, '/admin/dashboard');
	}

	// If user already has organization, skip onboarding
	if (locals.user.organizationId) {
		throw redirect(302, `/o/${locals.user.organizationId}/dashboard`);
	}

	// Get or create onboarding session
	let session = await getOnboardingSession(locals.db, locals.user.id);

	if (!session) {
		// Create new session
		const { OnboardingService } = await import('$lib/services/onboarding');
		const service = new OnboardingService(locals.db);
		await service.createSession(locals.user.id);
		session = await getOnboardingSession(locals.db, locals.user.id);
	}

	// Determine current step from URL or session
	const path = url.pathname;
	let currentStep = 1;

	if (path.includes('langkah-2')) currentStep = 2;
	else if (path.includes('langkah-3')) currentStep = 3;
	else if (path.includes('langkah-4')) currentStep = 4;
	else if (path.includes('selesai')) currentStep = 5;

	// If completed and not on selesai page, redirect to selesai
	if (session?.is_completed && !path.includes('selesai')) {
		throw redirect(302, '/onboarding/selesai');
	}

	// If completed and on selesai page, load organization data
	if (session?.is_completed && path.includes('selesai')) {
		const { OrganizationService } = await import('$lib/services/organization');
		const orgService = new OrganizationService(locals.db);
		const organization = await orgService.getByUserId(locals.user.id);

		return {
			user: locals.user,
			onboarding: session,
			currentStep: 5,
			organization
		};
	}

	// Don't allow skipping steps
	const maxCompleted = JSON.parse(session?.completed_steps || '[]').length;
	if (currentStep > maxCompleted + 1) {
		throw redirect(302, `/onboarding/langkah-${maxCompleted + 1}`);
	}

	return {
		user: locals.user,
		onboarding: session,
		currentStep
	};
};
