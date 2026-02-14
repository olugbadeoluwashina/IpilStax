import { type Kysely, sql } from "kysely";
import { Database } from '../db_schema.ts';

export async function up(db: Kysely<Database>): Promise<void> {
  // We use .schema to build the structure
  await db.schema
    .createTable("test_cases")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("body", "text", (col) => col.defaultTo(''))
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("expected_result", "text", (col) => col.notNull())
    .addColumn("version", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  // If we need to go back, we just delete the table
  await db.schema.dropTable("test_cases").execute();
}