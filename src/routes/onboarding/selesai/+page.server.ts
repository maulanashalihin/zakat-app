import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);

	if (!tempData.step1) {
		throw redirect(302, '/onboarding/langkah-1');
	}

	// Get organization from database (already created by completeOnboarding)
	const organization = await locals.db
		.selectFrom('organizations')
		.select(['id', 'name', 'slug'])
		.where('slug', '=', tempData.step1.slug)
		.executeTakeFirst();

	if (!organization) {
		throw redirect(302, '/onboarding/langkah-1');
	}

	return { organization };
};