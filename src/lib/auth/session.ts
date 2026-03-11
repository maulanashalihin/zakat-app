import { dev } from '$app/environment';
import type { Kysely } from 'kysely';
import type { Database } from '$lib/db';

// Session duration: 30 days (in milliseconds)
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

// Cookie name
const SESSION_COOKIE_NAME = 'auth_session';

// Cookie attributes
const COOKIE_ATTRIBUTES = {
	httpOnly: true,
	secure: !dev,
	sameSite: 'lax' as const,
	path: '/',
	maxAge: SESSION_DURATION / 1000 // in seconds
};

// ⭐ NEW: Organization membership info
export interface OrganizationMembership {
	organizationId: string;
	organizationName: string;
	organizationSlug: string;
	organizationLogo: string | null;
	role: 'admin' | 'petugas' | 'viewer';
	sectorId: string | null;
	isActive: boolean;
}

// User attributes yang akan di-return dari session
export interface SessionUser {
	id: string;
	email: string;
	name: string;
	provider: 'email' | 'google';
	avatar: string | null;
	createdAt: number;
	// ⭐ NEW: Global role and memberships
	globalRole: 'super_admin' | 'user';
	primaryOrganizationId: string | null;
	memberships: OrganizationMembership[];
	// ⭐ For backward compatibility - current active org
	currentOrganizationId: string | null;
	currentRole: 'admin' | 'petugas' | 'viewer' | null;
	currentSectorId: string | null;
}

// Session interface
export interface Session {
	id: string;
	userId: string;
	expiresAt: number;
	fresh: boolean;
}

// Cookie interface
export interface SessionCookie {
	name: string;
	value: string;
	attributes: {
		httpOnly: boolean;
		secure: boolean;
		sameSite: 'lax' | 'strict' | 'none';
		path: string;
		maxAge?: number;
		expires?: Date;
	};
}

export function generateId(): string {
	return crypto.randomUUID();
}

export function generateSessionToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function createSession(
	db: Kysely<Database>,
	userId: string
): Promise<Session> {
	const sessionId = generateSessionToken();
	const expiresAt = Date.now() + SESSION_DURATION;

	await db
		.insertInto('sessions')
		.values({
			id: sessionId,
			user_id: userId,
			expires_at: expiresAt
		})
		.execute();

	return {
		id: sessionId,
		userId,
		expiresAt,
		fresh: true
	};
}

export async function validateSession(
	db: Kysely<Database>,
	sessionId: string
): Promise<{ user: SessionUser | null; session: Session | null }> {
	if (!sessionId) {
		return { user: null, session: null };
	}

	try {
		const result = await db
			.selectFrom('sessions')
			.innerJoin('users', 'sessions.user_id', 'users.id')
			.where('sessions.id', '=', sessionId)
			.select([
				'sessions.id as session_id',
				'sessions.user_id',
				'sessions.expires_at',
				'users.id as user_id',
				'users.email',
				'users.name',
				'users.provider',
				'users.avatar',
				'users.created_at',
				'users.global_role',
				'users.primary_organization_id',
				'users.sector_id',
				'users.is_active'
			])
			.executeTakeFirst();

		if (!result) {
			return { user: null, session: null };
		}

		if (Date.now() > result.expires_at) {
			await db
				.deleteFrom('sessions')
				.where('id', '=', sessionId)
				.execute();
			return { user: null, session: null };
		}

		const fifteenDays = 15 * 24 * 60 * 60 * 1000;
		let fresh = false;

		if (result.expires_at - Date.now() < fifteenDays) {
			const newExpiresAt = Date.now() + SESSION_DURATION;
			await db
				.updateTable('sessions')
				.set({ expires_at: newExpiresAt })
				.where('id', '=', sessionId)
				.execute();
			result.expires_at = newExpiresAt;
			fresh = true;
		}

		// ⭐ NEW: Load user's organization memberships
		const memberships = await db
			.selectFrom('organization_members')
			.innerJoin('organizations', 'organization_members.organization_id', 'organizations.id')
			.select([
				'organization_members.organization_id',
				'organization_members.role',
				'organization_members.sector_id',
				'organization_members.is_active',
				'organizations.id as org_id',
				'organizations.name as org_name',
				'organizations.slug as org_slug',
				'organizations.logo_url as org_logo'
			])
			.where('organization_members.user_id', '=', result.user_id)
			.where('organization_members.is_active', '=', 1)
			.execute();

		const membershipList: OrganizationMembership[] = memberships.map(m => ({
			organizationId: m.organization_id,
			organizationName: m.org_name,
			organizationSlug: m.org_slug,
			organizationLogo: m.org_logo,
			role: m.role as 'admin' | 'petugas' | 'viewer',
			sectorId: m.sector_id,
			isActive: m.is_active === 1
		}));

		// Set current organization (primary or first membership)
		const currentMembership = membershipList.find(m => m.organizationId === result.primary_organization_id) 
			|| membershipList[0] 
			|| null;

		const user: SessionUser = {
			id: result.user_id,
			email: result.email,
			name: result.name,
			provider: result.provider as 'email' | 'google',
			avatar: result.avatar ?? null,
			createdAt: result.created_at ?? Date.now(),
			globalRole: result.global_role as 'super_admin' | 'user',
			primaryOrganizationId: result.primary_organization_id,
			memberships: membershipList,
			currentOrganizationId: currentMembership?.organizationId || null,
			currentRole: currentMembership?.role || null,
			currentSectorId: currentMembership?.sectorId || null
		};

		const session: Session = {
			id: result.session_id,
			userId: result.user_id,
			expiresAt: result.expires_at,
			fresh
		};

		return { user, session };
	} catch (error) {
		console.error('Session validation error:', error);
		return { user: null, session: null };
	}
}

export async function invalidateSession(
	db: Kysely<Database>,
	sessionId: string
): Promise<void> {
	if (!sessionId) return;

	try {
		await db
			.deleteFrom('sessions')
			.where('id', '=', sessionId)
			.execute();
	} catch (error) {
		console.error('Session invalidation error:', error);
	}
}

export async function invalidateUserSessions(
	db: Kysely<Database>,
	userId: string
): Promise<void> {
	try {
		await db
			.deleteFrom('sessions')
			.where('user_id', '=', userId)
			.execute();
	} catch (error) {
		console.error('User sessions invalidation error:', error);
	}
}

export function createSessionCookie(sessionId: string): SessionCookie {
	return {
		name: SESSION_COOKIE_NAME,
		value: sessionId,
		attributes: {
			...COOKIE_ATTRIBUTES,
			maxAge: SESSION_DURATION / 1000
		}
	};
}

export function createBlankSessionCookie(): SessionCookie {
	return {
		name: SESSION_COOKIE_NAME,
		value: '',
		attributes: {
			...COOKIE_ATTRIBUTES,
			maxAge: 0,
			expires: new Date(0)
		}
	};
}

export function getSessionCookieName(): string {
	return SESSION_COOKIE_NAME;
}

export function serializeCookie(cookie: SessionCookie): string {
	const { name, value, attributes } = cookie;

	let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

	if (attributes.path) {
		cookieString += `; Path=${attributes.path}`;
	}

	if (attributes.httpOnly) {
		cookieString += '; HttpOnly';
	}

	if (attributes.secure) {
		cookieString += '; Secure';
	}

	if (attributes.sameSite) {
		cookieString += `; SameSite=${attributes.sameSite}`;
	}

	if (attributes.maxAge !== undefined) {
		cookieString += `; Max-Age=${attributes.maxAge}`;
	}

	if (attributes.expires) {
		cookieString += `; Expires=${attributes.expires.toUTCString()}`;
	}

	return cookieString;
}
