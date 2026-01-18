import type { Generated } from "kysely";

export interface TestCasesTable {
  id: Generated<string>; // UUID
  title: string;
  body: string;
  expected_result: string;
  status: string;
  version: Generated<number>;
  // Generated<T> tells Kysely that the DB handles this value automatically
  created_at: Generated<Date>;
}


export interface Database {
  test_cases: TestCasesTable;
}