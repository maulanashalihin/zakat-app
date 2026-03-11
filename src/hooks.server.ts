import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Database } from '$lib/db';
import { validateSession, getSessionCookieName } from '$lib/auth/session';
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

		// ⭐ NEW: Check organization access and onboarding status
		if (user) {
			const pathname = event.url.pathname;

			// Super admin can access everything
			if (user.globalRole === 'super_admin') {
				// Redirect super admin to admin dashboard if not in org context
				if (pathname === '/dashboard' || pathname === '/') {
					return new Response(null, {
						status: 302,
						headers: { Location: '/admin/dashboard' }
					});
				}
			} else {
				// Regular user must have organization membership
				const isPublicRoute = pathname === '/login' ||
				                      pathname === '/register' ||
				                      pathname === '/' ||
				                      pathname.startsWith('/auth') ||
				                      pathname.startsWith('/onboarding');

				if (!isPublicRoute && user.memberships.length === 0) {
					// User has no organization membership - redirect to onboarding
					return new Response(null, {
						status: 302,
						headers: { Location: '/onboarding/langkah-1' }
					});
				}

				// Check if trying to access organization without membership
				if (pathname.startsWith('/o/')) {
					const orgSlug = pathname.split('/')[2];
					const hasAccess = user.memberships.some(m => m.organizationSlug === orgSlug && m.isActive);
					
					if (!hasAccess) {
						// Redirect to first available organization or onboarding
						if (user.memberships.length > 0) {
							const firstOrg = user.memberships[0];
							return new Response(null, {
								status: 302,
								headers: { Location: `/o/${firstOrg.organizationSlug}/dashboard` }
							});
						} else {
							return new Response(null, {
								status: 302,
								headers: { Location: '/onboarding/langkah-1' }
							});
						}
					}
				}
			}
		}
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
