import type { Kysely } from 'kysely';
import type { Database, Organization, NewOrganization } from '$lib/db';

export class OrganizationService {
  constructor(private db: Kysely<Database>) {}

  async getById(id: string): Promise<Organization | undefined> {
    return this.db
      .selectFrom('organizations')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getBySlug(slug: string): Promise<Organization | undefined> {
    return this.db
      .selectFrom('organizations')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();
  }

  async listAll(): Promise<Organization[]> {
    return this.db
      .selectFrom('organizations')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
  }

  async listActive(): Promise<Organization[]> {
    return this.db
      .selectFrom('organizations')
      .selectAll()
      .where('is_active', '=', 1)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async create(data: NewOrganization): Promise<string> {
    const id = crypto.randomUUID();
    await this.db
      .insertInto('organizations')
      .values({
        id,
        ...data,
        created_at: Date.now(),
        updated_at: Date.now()
      })
      .execute();
    return id;
  }

  async update(id: string, data: Partial<NewOrganization>): Promise<void> {
    await this.db
      .updateTable('organizations')
      .set({
        ...data,
        updated_at: Date.now()
      })
      .where('id', '=', id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.db
      .deleteFrom('organizations')
      .where('id', '=', id)
      .execute();
  }

  async deactivate(id: string): Promise<void> {
    await this.db
      .updateTable('organizations')
      .set({ is_active: 0, updated_at: Date.now() })
      .where('id', '=', id)
      .execute();
  }

  async getStats(id: string): Promise<{
    userCount: number;
    muzakiCount: number;
    mustahikCount: number;
    sectorCount: number;
  }> {
    const [userResult, muzakiResult, mustahikResult, sectorResult] = await Promise.all([
      this.db
        .selectFrom('users')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', id)
        .executeTakeFirst(),
      this.db
        .selectFrom('muzaki')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', id)
        .executeTakeFirst(),
      this.db
        .selectFrom('mustahik')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', id)
        .executeTakeFirst(),
      this.db
        .selectFrom('sectors')
        .select((eb) => eb.fn.count('id').as('count'))
        .where('organization_id', '=', id)
        .executeTakeFirst()
    ]);

    return {
      userCount: Number(userResult?.count ?? 0),
      muzakiCount: Number(muzakiResult?.count ?? 0),
      mustahikCount: Number(mustahikResult?.count ?? 0),
      sectorCount: Number(sectorResult?.count ?? 0)
    };
  }

  // Generate URL-friendly slug
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }

  // Check if slug is available
  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    let query = this.db
      .selectFrom('organizations')
      .select('id')
      .where('slug', '=', slug);
    
    if (excludeId) {
      query = query.where('id', '!=', excludeId);
    }
    
    const result = await query.executeTakeFirst();
    return !result;
  }
}

// Helper function for slug generation
export function generateSlug(name: string): string {
  return OrganizationService.generateSlug(name);
}

export async function getOrganizationBySlug(
  db: Kysely<Database>,
  slug: string
): Promise<Organization | undefined> {
  return new OrganizationService(db).getBySlug(slug);
}

export async function listOrganizations(
  db: Kysely<Database>
): Promise<Organization[]> {
  return new OrganizationService(db).listAll();
}
