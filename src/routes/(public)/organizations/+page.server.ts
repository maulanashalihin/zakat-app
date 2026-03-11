import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAccessibleOrganizations } from '$lib/auth/organization';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// If user has organization, redirect to it
	if (locals.user.organizationId && locals.user.currentRole !== 'super_admin') {
		const org = await locals.db
			.selectFrom('organizations')
			.select('slug')
			.where('id', '=', locals.user.organizationId)
			.executeTakeFirst();
		
		if (org) {
			throw redirect(302, `/o/${org.slug}/dashboard`);
		}
	}

	// Get accessible organizations
	const organizations = await getAccessibleOrganizations(locals.db, locals.user);

	// Get stats for each organization
	const orgsWithStats = await Promise.all(
		organizations.map(async (org) => {
			const [muzakiResult, userResult] = await Promise.all([
				locals.db
					.selectFrom('muzaki')
					.select((eb) => eb.fn.count('id').as('count'))
					.where('organization_id', '=', org.id)
					.executeTakeFirst(),
				locals.db
					.selectFrom('users')
					.select((eb) => eb.fn.count('id').as('count'))
					.where('organization_id', '=', org.id)
					.executeTakeFirst()
			]);

			return {
				...org,
				muzakiCount: Number(muzakiResult?.count ?? 0),
				userCount: Number(userResult?.count ?? 0)
			};
		})
	);

	return {
		organizations: orgsWithStats,
		user: locals.user
	};
};
