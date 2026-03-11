import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);

	if (!tempData.step1) {
		throw redirect(302, '/onboarding/langkah-1');
	}

	// Get organization info
	const org = {
		name: tempData.step1.name,
		slug: tempData.step1.slug,
		sectors: tempData.step3?.sectors || []
	};

	return { organization: org };
};