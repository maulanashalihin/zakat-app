import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';
import { OrganizationService } from '$lib/services/organization';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);
	
	return {
		savedData: tempData.step1
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		
		const name = formData.get('name')?.toString().trim() || '';
		const address = formData.get('address')?.toString().trim() || '';
		const phone = formData.get('phone')?.toString().trim() || '';
		const email = formData.get('email')?.toString().trim() || '';
		
		// Validation
		const errors: Record<string, string> = {};
		
		if (!name || name.length < 3) {
			errors.name = 'Nama organisasi minimal 3 karakter';
		}
		
		if (!address || address.length < 10) {
			errors.address = 'Alamat minimal 10 karakter';
		}
		
		if (email && !email.includes('@')) {
			errors.email = 'Format email tidak valid';
		}
		
		// Generate slug
		const slug = OrganizationService.generateSlug(name);
		
		// Check slug availability
		const orgService = new OrganizationService(locals.db);
		const isAvailable = await orgService.isSlugAvailable(slug);
		
		if (!isAvailable) {
			errors.name = 'Nama organisasi sudah digunakan, coba nama lain';
		}
		
		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { name, address, phone, email } });
		}
		
		// Save step data
		const onboardingService = new OnboardingService(locals.db);
		await onboardingService.saveStep1(locals.user!.id, {
			name,
			slug,
			address,
			phone: phone || undefined,
			email: email || undefined
		});
		
		throw redirect(302, '/onboarding/langkah-2');
	}
};
