import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Check authentication
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  // Only super_admin can access users page
  if (locals.user.globalRole !== 'super_admin') {
    throw error(403, 'Access denied. Super admin only.');
  }

  // Fetch users directly from database (no client-side fetch needed)
  const users = await locals.db
    .selectFrom('users')
    .select([
      'id',
      'email',
      'name',
      'provider',
      'email_verified',
      'avatar',
      'created_at'
    ])
    .orderBy('created_at', 'desc')
    .execute();

  return {
    users,
    user: locals.user
  };
};
