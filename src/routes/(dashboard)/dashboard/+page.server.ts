import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Check authentication
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  // Redirect to appropriate dashboard based on user role and organization
  // This dummy dashboard is deprecated in favor of organization-specific dashboards
  
  // Super admin goes to admin dashboard
  if (locals.user.role === 'super_admin') {
    throw redirect(302, '/admin/dashboard');
  }

  // User with organization goes to their org dashboard
  if (locals.user.organizationId) {
    const org = await locals.db
      .selectFrom('organizations')
      .select('slug')
      .where('id', '=', locals.user.organizationId)
      .executeTakeFirst();
    
    if (org?.slug) {
      throw redirect(302, `/o/${org.slug}/dashboard`);
    }
  }

  // User without organization goes to onboarding to create one
  throw redirect(302, '/onboarding/langkah-1');
};
