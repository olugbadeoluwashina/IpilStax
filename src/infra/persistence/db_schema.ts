import type { ColumnType, Generated } from 'kysely';
import type { TestCaseStatus } from '@ipinstaq/shared/types/types.ts';

export interface TestCasesTable {
  id: Generated<string>; // UUID
  title: string;
  body: string;
  test_case_id: Generated<string> // Unique identifier for the test case
  expected_result: string;
  status: TestCaseStatus;
  version: Generated<number>;
  project_id: ColumnType<string, string, never>; // Foreign key to ProjectsTable
  suite_id?: string; // Foreign key to TestSuitesTable
  category_id?: string; // Foreign key to TestCategoriesTable
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface TestSuitesTable {
  id: Generated<string>; // UUID
  name: string;
  description?: string;
  created_at: Generated<Date>;
  updated_at?: Generated<Date>;
}

export interface TestCategoriesTable {
  id: Generated<string>; // UUID
  name: string;
  parent_id?: string; // Self-referencing foreign key
  suites_id: string; // Foreign key to TestSuitesTable
}

export interface ProjectsTable {
  id: Generated<string>; // UUID
  name: string;
  project_code: ColumnType<string, string, never> ; // Unique project code
  description: string | null;
  created_at: ColumnType<Date, Date, never>;
  updated_at: ColumnType<Date, Date, never>
  last_project_code_number: number; // To track the last used number for project code generation
}

export interface Database {
  test_cases: TestCasesTable;
  test_suites: TestSuitesTable;
  test_categories: TestCategoriesTable;
  test_projects: ProjectsTable;
}
