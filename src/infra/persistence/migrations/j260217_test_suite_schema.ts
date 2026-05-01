import { sql } from 'kysely';
import type { Kysely } from 'kysely';
import type { Database } from '../db_schema.ts';

export async function up(db: Kysely<Database>) {
    await db.schema
        .createTable("test_projects")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("project_code", "varchar(10)", (col) => col.notNull().unique())
        .addColumn("description", "text")
        .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn("last_project_code_number", "integer", (col) => col.notNull().defaultTo(0))
        .execute();


    await db.schema
        .createTable("test_suites")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
        .execute();

    await db.schema
        .createTable("test_categories")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("parent_id", "uuid", (col) => col.references("test_categories.id").onDelete("cascade"))
        .addColumn("suites_id", "uuid", (col) => col.notNull().references("test_suites.id").onDelete("cascade"))
        .execute();

    await db.schema
        .alterTable("test_cases")
        .addColumn("test_case_id", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("suite_id", "uuid", (col) => col.references("test_suites.id").onDelete("set null"))
        .addColumn("project_id", "uuid", (col) => col.references("test_projects.id").onDelete("cascade").notNull())
        .addColumn("category_id", "uuid", (col) => col.references("test_categories.id").onDelete("set null"))
        .addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql`now()`))
        .execute();
    
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Reverse order: Drop columns first, then tables
  await db.schema.alterTable("test_cases").dropColumn("category_id").execute();
  await db.schema.alterTable("test_cases").dropColumn("suite_id").execute();
  await db.schema.alterTable("test_cases").dropColumn("test_case_id").execute();
  await db.schema.alterTable("test_cases").dropColumn("updated_at").execute();
  await db.schema.alterTable("test_cases").dropColumn("project_id").execute();
  await db.schema.dropTable("test_projects").execute();
  await db.schema.dropTable("test_categories").execute();
  await db.schema.dropTable("test_suites").execute();

}