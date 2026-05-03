import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './db_schema.ts';
import { TestCaseRepository } from './test_case.repository.ts';
import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import type { ITestProjectRepository } from '@ipinstaq/core/logic/test_project/test_project_repo.ts';
import { TestProjectRepository } from './test_project.repository.ts';

const connectionString = Deno.env.get('DATABASE_URL');

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing!");
}

export const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString,
    ssl: connectionString.includes('neon.tech')? {rejectUnauthorized: false,} : false,
  }),
});

export function getDb() {
  return new Kysely<Database>({
    dialect,
  });
}

export function createTestCaseRepository(): ITestCaseRepository {
  // Here you would normally set up your actual repository, e.g., connecting to a database
  const db = getDb(); // Assume getDb() initializes and returns your database connection
  return new TestCaseRepository(db);
}

export function createTestProjectRepository(): ITestProjectRepository {
  const db = getDb();
  return new TestProjectRepository(db);
}