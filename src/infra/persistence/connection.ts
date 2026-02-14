import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './db_schema.ts';

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: Deno.env.get('DATABASE_URL'),
  }),
});

export function getDb() {
  return new Kysely<Database>({
    dialect,
  });
}