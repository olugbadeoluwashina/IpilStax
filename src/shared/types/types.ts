import type { TestCasesTable } from '@ipinstaq/infra/persistence/db_schema.ts';
import type { Insertable } from 'kysely';

export type NewTestCase = Insertable<TestCasesTable>;