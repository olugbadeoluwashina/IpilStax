import type { TestCasesTable } from '@ipinstaq/infra/persistence/db_schema.ts';
import type { Insertable, Selectable, Updateable } from 'kysely';
import type z from 'zod';
import type { TestCaseSchema, CreateTestCaseSchema, TestCaseStatusSchema } from '@ipinstaq/core/schema/test_case.ts';
import type { TestSuiteSchema } from '@ipinstaq/core/schema/test_suite.ts';
import { TestProjectSchema } from '@ipinstaq/core/schema/test_project.ts';

export type KyselyNewTestCase = Insertable<TestCasesTable>;
export type KyselyATestCase = Selectable<TestCasesTable>;
export type KyselyUpdateTestCase = Updateable<TestCasesTable>;

export type TestCase = z.infer<typeof TestCaseSchema>;
export type CreateTestCaseInput = z.infer<typeof CreateTestCaseSchema>;
export type TestCaseStatus = z.infer<typeof TestCaseStatusSchema>;
export type UpdateTestCaseInput =  Partial<CreateTestCaseInput> & { id: string };

export type TestSuite = z.infer<typeof TestSuiteSchema>;
export type TestSuiteInput = Omit<TestSuite, 'id' | 'createdAt' | 'updatedAt'>;

export type TestProject = z.infer<typeof TestProjectSchema>;
export type TestProjectInput = Omit<TestProject, 'id' | 'createdAt' | 'updatedAt' | 'projectCode'>;
