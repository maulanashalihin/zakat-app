import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Get platform stats
	const [orgResult, userResult, muzakiResult, mustahikResult] = await Promise.all([
		locals.db
			.selectFrom('organizations')
			.select((eb) => eb.fn.count('id').as('count'))
			.executeTakeFirst(),
		locals.db
			.selectFrom('users')
			.select((eb) => eb.fn.count('id').as('count'))
			.executeTakeFirst(),
		locals.db
			.selectFrom('muzaki')
			.select((eb) => eb.fn.count('id').as('count'))
			.executeTakeFirst(),
		locals.db
			.selectFrom('mustahik')
			.select((eb) => eb.fn.count('id').as('count'))
			.executeTakeFirst()
	]);
	
	// Get recent organizations
	const recentOrgs = await locals.db
		.selectFrom('organizations')
		.select(['id', 'name', 'slug', 'created_at'])
		.orderBy('created_at', 'desc')
		.limit(5)
		.execute();
	
	return {
		stats: {
			organizations: Number(orgResult?.count ?? 0),
			users: Number(userResult?.count ?? 0),
			muzaki: Number(muzakiResult?.count ?? 0),
			mustahik: Number(mustahikResult?.count ?? 0)
		},
		recentOrganizations: recentOrgs
	};
};
