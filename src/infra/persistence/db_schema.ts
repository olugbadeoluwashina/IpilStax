import type { Generated } from 'kysely';
import type { TestCaseStatus } from '@ipinstaq/shared/types/types.ts';

export interface TestCasesTable {
  id: Generated<string>; // UUID
  title: string;
  body: string;
  expected_result: string;
  status: TestCaseStatus;
  version: Generated<number>;
  // Generated<T> tells Kysely that the DB handles this value automatically
  created_at: Generated<Date>;
  updated_at?: Generated<Date>;
}

export interface Database {
  test_cases: TestCasesTable;
}
