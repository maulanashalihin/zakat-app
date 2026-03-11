import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // ✅ INDEX: organization_id on muzaki table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_muzaki_organization_id 
    ON muzaki(organization_id)
  `.execute(db);

  // ✅ INDEX: sector_id on muzaki table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_muzaki_sector_id 
    ON muzaki(sector_id)
  `.execute(db);

  // ✅ INDEX: created_at on muzaki table (for ordering)
  await sql`
    CREATE INDEX IF NOT EXISTS idx_muzaki_created_at 
    ON muzaki(created_at DESC)
  `.execute(db);

  // ✅ COMPOSITE INDEX: organization_id + sector_id on muzaki
  await sql`
    CREATE INDEX IF NOT EXISTS idx_muzaki_org_sector 
    ON muzaki(organization_id, sector_id)
  `.execute(db);

  // ✅ INDEX: organization_id on mustahik table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_mustahik_organization_id 
    ON mustahik(organization_id)
  `.execute(db);

  // ✅ INDEX: sector_id on mustahik table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_mustahik_sector_id 
    ON mustahik(sector_id)
  `.execute(db);

  // ✅ INDEX: created_at on mustahik table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_mustahik_created_at 
    ON mustahik(created_at DESC)
  `.execute(db);

  // ✅ INDEX: organization_id on sectors table
  await sql`
    CREATE INDEX IF NOT EXISTS idx_sectors_organization_id 
    ON sectors(organization_id)
  `.execute(db);

  // ✅ INDEX: is_active on sectors table (for filtering)
  await sql`
    CREATE INDEX IF NOT EXISTS idx_sectors_is_active 
    ON sectors(is_active)
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop all indexes
  await sql`DROP INDEX IF EXISTS idx_muzaki_organization_id`.execute(db);
  await sql`DROP INDEX IF EXISTS idx_muzaki_sector_id`.execute(db);
  await sql`DROP INDEX IF EXISTS idx_muzaki_created_at`.execute(db);
  await sql`DROP INDEX IF EXISTS idx_muzaki_org_sector`.execute(db);
  
  await sql`DROP INDEX IF EXISTS idx_mustahik_organization_id`.execute(db);
  await sql`DROP INDEX IF EXISTS idx_mustahik_sector_id`.execute(db);
  await sql`DROP INDEX IF EXISTS idx_mustahik_created_at`.execute(db);
  
  await sql`DROP INDEX IF EXISTS idx_sectors_organization_id`.execute(db);
  await sql`DROP INDEX IF EXISTS idx_sectors_is_active`.execute(db);
}
