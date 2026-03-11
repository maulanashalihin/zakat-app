import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);
	
	return {
		savedData: tempData.step4,
		// Load sectors from step 3 for selection
		sectors: tempData.step3?.sectors || []
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		
		// Check if user wants to skip
		const skip = formData.get('skip') === 'true';
		
		const onboardingService = new OnboardingService(locals.db);
		
		if (skip) {
			// Skip adding members
			await onboardingService.saveStep4(locals.user!.id, { skip: true, members: [] });

			// Complete onboarding
			const result = await onboardingService.completeOnboarding(locals.user!.id);
			throw redirect(302, '/onboarding/selesai');
		}
		
		// Parse members from form data
		const members: Array<{ name: string; email: string; role: 'petugas' | 'viewer'; sectorId?: string }> = [];
		let index = 0;
		
		while (formData.has(`members[${index}][name]`)) {
			const name = formData.get(`members[${index}][name]`)?.toString().trim();
			const email = formData.get(`members[${index}][email]`)?.toString().trim();
			
			if (name && email) {
				members.push({
					name,
					email,
					role: (formData.get(`members[${index}][role]`)?.toString() as 'petugas' | 'viewer') || 'petugas',
					sectorId: formData.get(`members[${index}][sectorId]`)?.toString() || undefined
				});
			}
			index++;
		}
		
		// Validation
		const errors: Record<string, string> = {};
		
		for (let i = 0; i < members.length; i++) {
			if (!members[i].email.includes('@')) {
				errors[`members[${i}].email`] = 'Format email tidak valid';
			}
		}
		
		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { members } });
		}
		
		// Save step data
		await onboardingService.saveStep4(locals.user!.id, { skip: false, members });

		// Complete onboarding
		const result = await onboardingService.completeOnboarding(locals.user!.id);
		throw redirect(302, '/onboarding/selesai');
	}
};
