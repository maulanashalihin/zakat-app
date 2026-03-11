import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { OnboardingService } from '$lib/services/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const service = new OnboardingService(locals.db);
	const tempData = await service.getTempData(locals.user!.id);
	
	// Default values
	const now = new Date();
	const currentYearHijri = 1446; // Approximate, should calculate properly
	const currentYearMasehi = now.getFullYear();
	
	return {
		savedData: tempData.step2,
		defaults: {
			defaultBerasPerJiwa: 2.5,
			defaultUangPerJiwa: 40000,
			yearHijri: currentYearHijri,
			yearMasehi: currentYearMasehi,
			periodName: `Ramadhan ${currentYearHijri} H`
		}
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		
		const defaultBerasPerJiwa = parseFloat(formData.get('defaultBerasPerJiwa')?.toString() || '2.5');
		const defaultUangPerJiwa = parseInt(formData.get('defaultUangPerJiwa')?.toString() || '50000');
		const yearHijri = parseInt(formData.get('yearHijri')?.toString() || '1447');
		const yearMasehi = parseInt(formData.get('yearMasehi')?.toString() || '2026');
		const periodName = formData.get('periodName')?.toString().trim() || `Ramadhan ${yearHijri} H`;
		
		// Validation
		const errors: Record<string, string> = {};
		
		if (defaultBerasPerJiwa <= 0) {
			errors.defaultBerasPerJiwa = 'Beras per jiwa harus lebih dari 0';
		}
		
		if (defaultUangPerJiwa <= 0) {
			errors.defaultUangPerJiwa = 'Uang per jiwa harus lebih dari 0';
		}
		
		if (yearHijri < 1400 || yearHijri > 1500) {
			errors.yearHijri = 'Tahun Hijriyah tidak valid';
		}
		
		if (yearMasehi < 2000 || yearMasehi > 2100) {
			errors.yearMasehi = 'Tahun Masehi tidak valid';
		}
		
		if (Object.keys(errors).length > 0) {
			return fail(400, { 
				errors, 
				values: { defaultBerasPerJiwa, defaultUangPerJiwa, yearHijri, yearMasehi, periodName } 
			});
		}
		
		// Save step data
		const onboardingService = new OnboardingService(locals.db);
		await onboardingService.saveStep2(locals.user!.id, {
			defaultBerasPerJiwa,
			defaultUangPerJiwa,
			yearHijri,
			yearMasehi,
			periodName
		});
		
		throw redirect(302, '/onboarding/langkah-3');
	}
};
