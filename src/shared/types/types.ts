import type { TestCasesTable } from '@ipinstaq/infra/persistence/db_schema.ts';
import type { Insertable, Selectable, Updateable } from 'kysely';
import type z from 'zod';
import type { TestCaseSchema, CreateTestCaseSchema, TestCaseStatusSchema } from '@ipinstaq/core/schema/test_case.ts';

export type KyselyNewTestCase = Insertable<TestCasesTable>;
export type KyselyATestCase = Selectable<TestCasesTable>;
export type KyselyUpdateTestCase = Updateable<TestCasesTable>;

export type TestCase = z.infer<typeof TestCaseSchema>;
export type CreateTestCaseInput = z.infer<typeof CreateTestCaseSchema>;
export type TestCaseStatus = z.infer<typeof TestCaseStatusSchema>;
export type UpdateTestCaseInput =  Partial<TestCase>;