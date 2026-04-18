import { sql, type Kysely } from 'kysely';
import type { Database } from '../db_schema.ts';

export async function up(db: Kysely<Database>): Promise<void> {
  // We use .schema to build the structure
  await db.schema
    .alterTable("test_cases")
    .addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Reverse order: Drop columns first, then tables
  await db.schema.alterTable("test_cases").dropColumn("updated_at").execute();
}