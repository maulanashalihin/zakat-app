import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { OrganizationService } from '$lib/services/organization';

export const load: PageServerLoad = async ({ locals }) => {
	const organizations = await locals.db
		.selectFrom('organizations')
		.selectAll()
		.orderBy('created_at', 'desc')
		.execute();
	
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
					.selectFrom('organization_members')
					.select((eb) => eb.fn.count('user_id').as('count'))
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
	
	return { organizations: orgsWithStats };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		
		const name = formData.get('name')?.toString().trim();
		const address = formData.get('address')?.toString().trim();
		const phone = formData.get('phone')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		
		if (!name || name.length < 3) {
			return fail(400, { error: 'Nama organisasi minimal 3 karakter' });
		}
		
		const slug = OrganizationService.generateSlug(name);
		
		// Check slug availability
		const service = new OrganizationService(locals.db);
		const isAvailable = await service.isSlugAvailable(slug);
		
		if (!isAvailable) {
			return fail(400, { error: 'Nama sudah digunakan' });
		}
		
		const orgId = await service.create({
			name,
			slug,
			address: address || undefined,
			phone: phone || undefined,
			email: email || undefined
		});
		
		// Create default settings
		await locals.db
			.insertInto('app_settings')
			.values({
				id: crypto.randomUUID(),
				organization_id: orgId,
				default_beras_per_jiwa: 2.5,
				default_uang_per_jiwa: 40000
			})
			.execute();
		
		return { success: true, orgId };
	},
	
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		
		if (!id) {
			return fail(400, { error: 'ID tidak valid' });
		}
		
		await locals.db
			.deleteFrom('organizations')
			.where('id', '=', id)
			.execute();
		
		return { success: true };
	}
};
