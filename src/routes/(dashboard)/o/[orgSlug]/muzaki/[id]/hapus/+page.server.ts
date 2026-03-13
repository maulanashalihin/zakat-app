import type { Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, params }) => {
		if (!locals.user) {
			throw error(403, 'Tidak memiliki izin');
		}

		// Get organization
		const organization = await locals.db
			.selectFrom('organizations')
			.select(['id', 'slug'])
			.where('slug', '=', params.orgSlug)
			.executeTakeFirst();

		if (!organization) {
			throw error(404, 'Organisasi tidak ditemukan');
		}

		// Check permission
		if (locals.user.currentRole !== 'admin' && locals.user.globalRole !== 'super_admin') {
			throw error(403, 'Tidak memiliki izin');
		}

		// Get muzaki to verify ownership
		const muzaki = await locals.db
			.selectFrom('muzaki')
			.select('id')
			.where('id', '=', params.id)
			.where('organization_id', '=', organization.id)
			.executeTakeFirst();

		if (!muzaki) {
			throw error(404, 'Data muzaki tidak ditemukan');
		}

		// Delete muzaki
		await locals.db
			.deleteFrom('muzaki')
			.where('id', '=', params.id)
			.execute();

		throw redirect(302, `/o/${params.orgSlug}/muzaki`);
	}
};
