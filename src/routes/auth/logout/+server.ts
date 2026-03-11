import { redirect, error, type RequestHandler } from '@sveltejs/kit';
import { invalidateSession, createBlankSessionCookie, getSessionCookieName } from '$lib/auth/session';

export const POST: RequestHandler = async ({ locals, cookies, platform }) => {
	try {
		if (!platform?.env.DB) {
			throw error(500, { message: 'Database not available' });
		}
		const sessionId = cookies.get(getSessionCookieName());
		if (sessionId) {
			await invalidateSession(locals.db, sessionId);
		}
		const blankCookie = createBlankSessionCookie();
		throw redirect(302, '/login', {
			headers: {
				'Set-Cookie': `${blankCookie.name}=${blankCookie.value}; Path=${blankCookie.attributes.path}; HttpOnly${blankCookie.attributes.secure ? '; Secure' : ''}; SameSite=${blankCookie.attributes.sameSite}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
			}
		});
	} catch (err: any) {
		console.error('Logout error:', err);
		if (err.status === 302) throw err;
		if (err.status) throw err;
		throw error(500, { message: 'Logout failed' });
	}
};
