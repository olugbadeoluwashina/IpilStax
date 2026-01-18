import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';

import type { Kysely } from 'kysely';
import type { Database } from './db_schema.ts';
import type { NewTestCase } from '@ipinstaq/shared/types/types.ts';

export class TestCaseRepository implements ITestCaseRepository {
  constructor(private db: Kysely<Database>) {}

  async save(testCase: TestCase): Promise<void> {
    const newTestCase: NewTestCase = {
      id: testCase.id,
      title: testCase.title,
      body: testCase.description,
      expected_result: testCase.expectedResult,
      status: testCase.status,
      version: testCase.version,
      created_at: testCase.createdAt,
    };

    await this.db.insertInto('test_cases').values(newTestCase).execute();
  }

  async getById(id: string): Promise<TestCase | null> {
    //to be implemented
    return null;
  }

  async listAll(): Promise<TestCase[]> {
    //to be implemented
    const rows = await this.db.selectFrom('test_cases').selectAll().execute();

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.body,
      expectedResult: row.expected_result,
      status: row.status,
      version: row.version,
      createdAt: row.created_at,
    }));
  }
}
