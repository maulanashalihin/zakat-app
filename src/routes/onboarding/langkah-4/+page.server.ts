import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);
	
	// Validate that previous steps are completed
	if (!tempData.step1) {
		throw redirect(302, '/onboarding/langkah-1');
	}
	if (!tempData.step2) {
		throw redirect(302, '/onboarding/langkah-2');
	}
	if (!tempData.step3 || tempData.step3.sectors.length === 0) {
		throw redirect(302, '/onboarding/langkah-3');
	}
	
	return {
		step1: tempData.step1,
		step2: tempData.step2,
		step3: tempData.step3
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const onboardingService = new OnboardingService(locals.db);
		
		// Step 4 is now just confirmation - no members to add
		// Save empty step 4 data
		await onboardingService.saveStep4(locals.user!.id, { skip: true, members: [] });

		// Complete onboarding
		const result = await onboardingService.completeOnboarding(locals.user!.id);
		throw redirect(302, '/onboarding/selesai');
	}
};
