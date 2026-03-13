/// <reference types="@cloudflare/workers-types" />

import type { Kysely } from 'kysely';
import type { Database } from '$lib/db';
import type { SessionUser, Session } from '$lib/auth/session';
import type { Organization } from '$lib/db';

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
			};
			context: ExecutionContext;
		}

		interface Locals {
			db: Kysely<Database>;
			user: SessionUser | null;
			session: Session | null;
		}
	}
}

export {};
