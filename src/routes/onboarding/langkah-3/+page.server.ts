import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);
	
	return {
		savedSectors: tempData.step3?.sectors || []
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		
		// Parse sectors from form data dynamically
		const sectors: Array<{ name: string; color: string }> = [];
		let index = 0;
		
		// Keep reading until no more sectors found
		while (formData.has(`sectors[${index}][name]`)) {
			const name = formData.get(`sectors[${index}][name]`)?.toString().trim();
			if (name) {
				sectors.push({
					name,
					color: formData.get(`sectors[${index}][color]`)?.toString() || '#3b82f6'
				});
			}
			index++;
		}
		
		// Validation
		const errors: Record<string, string> = {};
		
		if (sectors.length === 0) {
			errors.sectors = 'Minimal 1 sektor diperlukan';
		}
		
		// Check for duplicate names
		const names = sectors.map(s => s.name.toLowerCase());
		if (new Set(names).size !== names.length) {
			errors.sectors = 'Nama sektor tidak boleh duplikat';
		}
		
		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { sectors } });
		}
		
		// Save step data
		const onboardingService = new OnboardingService(locals.db);
		await onboardingService.saveStep3(locals.user!.id, { sectors });
		
		throw redirect(302, '/onboarding/langkah-4');
	}
};
