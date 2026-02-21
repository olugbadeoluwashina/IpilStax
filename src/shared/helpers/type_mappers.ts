import type { KyselyATestCase, TestCase, TestProject } from '@ipinstaq/shared/types/types.ts';

export function toTestCase(row: KyselyATestCase ): TestCase {
  return {
    id: row.id,
    title: row.title,
    testCaseId: row.test_case_id,
    description: row.body,
    expectedResult: row.expected_result,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
  };
}

export function toProject(row: KyselyAProject): TestProject {
  return {
    id: row.id,
    name: row.name,
    projectCode: row.project_code,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}