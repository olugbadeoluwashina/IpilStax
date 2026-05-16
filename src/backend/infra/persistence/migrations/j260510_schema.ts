import type { Kysely } from 'kysely';
import type { Database } from '../db_schema.ts';
import { TestCasePriority } from '@ipinstaq/core/schema/test_case.ts';

export async function up(db: Kysely<Database>) {
  await db.schema.alterTable('test_cases')
    .addColumn('pre_conditions', 'text', (col) => col.defaultTo(''))
    .addColumn('steps', 'text', (col) => col.defaultTo(''))
    .addColumn('priority', 'smallint', (col) => col.defaultTo(TestCasePriority.LOW))
    .alterColumn('expected_result', (col) => col.setDefault(''))
    .addColumn('actual_result', 'text', (col) => col.defaultTo(''))
    .addColumn('execution_date', 'timestamp', (col) => col.defaultTo(null))
    .addColumn('execution_status', 'text', (col) => col.defaultTo(''))
    .execute()
}

export async function down(db: Kysely<Database>) {
    await db.schema.alterTable('test_cases')
      .dropColumn('pre_conditions')
      .dropColumn('steps')
      .dropColumn('priority')
      .dropColumn('actual_result')
      .dropColumn('execution_date')
      .dropColumn('execution_status')
      .execute()
}
