import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Database } from '$lib/db';
import { validateSession, getSessionCookieName } from '$lib/auth/session';
import { needsOnboarding, isSuperAdmin } from '$lib/auth/organization';
import { getOnboardingSession } from '$lib/services/onboarding';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize Kysely database
	if (event.platform?.env.DB) {
		event.locals.db = new Kysely<Database>({
			dialect: new D1Dialect({
				database: event.platform.env.DB,
			}),
		});
	} else {
		throw new Error('D1 Database binding not found');
	}

	// Get session from cookie
	const sessionId = event.cookies.get(getSessionCookieName()) ?? null;

	if (sessionId) {
		// Validate session
		const { user, session } = await validateSession(event.locals.db, sessionId);

		if (session?.fresh) {
			// Session was refreshed, update cookie
			event.cookies.set(getSessionCookieName(), session.id, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/',
				maxAge: 30 * 24 * 60 * 60 // 30 days
			});
		}

		if (!session) {
			// Session invalid, clear cookie
			event.cookies.set(getSessionCookieName(), '', {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/',
				maxAge: 0,
				expires: new Date(0)
			});
		}

		// Set user in locals
		event.locals.user = user;
		event.locals.session = session;

		// ⭐ NEW: Check onboarding status for authenticated users
		if (user) {
			const pathname = event.url.pathname;
			
			// Skip onboarding check for super admin
			if (!isSuperAdmin(user)) {
				// Check if user needs onboarding
				const needsOnboard = needsOnboarding(user);
				const onboardingSession = await getOnboardingSession(event.locals.db, user.id);
				const isInOnboarding = pathname.startsWith('/onboarding');
				const isPublicRoute = pathname === '/login' || 
				                      pathname === '/register' || 
				                      pathname === '/' ||
				                      pathname.startsWith('/auth');
				
				if (needsOnboard && !isInOnboarding && !isPublicRoute) {
					// User needs onboarding and not in onboarding flow
					return new Response(null, {
						status: 302,
						headers: { Location: '/onboarding/langkah-1' }
					});
				}
				
				if (!needsOnboard && isInOnboarding) {
					// User already has org but trying to access onboarding
					// Get organization slug
					const org = await event.locals.db
						.selectFrom('organizations')
						.select('slug')
						.where('id', '=', user.organizationId!)
						.executeTakeFirst();

					const redirectPath = org?.slug ? `/o/${org.slug}/dashboard` : '/dashboard';
					return new Response(null, {
						status: 302,
						headers: { Location: redirectPath }
					});
				}
			}
		}
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
