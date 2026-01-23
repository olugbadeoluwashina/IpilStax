import type { TestCasesTable } from '@ipinstaq/infra/persistence/db_schema.ts';
import type { Insertable, Selectable } from 'kysely';
import z from 'zod';

export type NewTestCase = Insertable<TestCasesTable>;
export type ATestCase = Selectable<TestCasesTable>;

export const TestCaseStatusSchema = z.enum({
  draft: 'draft',
  active: 'active',
  archived: 'archived',
});

export type TestCaseStatus = z.infer<typeof TestCaseStatusSchema>;
