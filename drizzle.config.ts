import type { Config } from 'drizzle-kit';

// Mode: Local SQLite untuk generate migration
// Untuk Drizzle Studio dengan D1, butuh credentials di .env

const isLocal = !process.env.CLOUDFLARE_ACCOUNT_ID;

export default {
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  ...(isLocal ? {} : {
    driver: 'd1-http',
    dbCredentials: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
      token: process.env.CLOUDFLARE_API_TOKEN!,
    },
  }),
} satisfies Config;
