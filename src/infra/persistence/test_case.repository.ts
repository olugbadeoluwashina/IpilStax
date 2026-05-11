import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';

import { type Kysely, sql } from 'kysely';
import type { Database } from './db_schema.ts';
import type {
  KyselyATestCase,
  KyselyNewTestCase,
  KyselyUpdateTestCase,
  TestCase,
} from '@ipinstaq/shared/types/types.ts';
import { toTestCase } from '@ipinstaq/shared/helpers/type_mappers.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';

export class TestCaseRepository implements ITestCaseRepository {
  constructor(private db: Kysely<Database>) {}

  async save(testCase: TestCase[], sequence: number): Promise<void> {

    //Map the fields correctly and return the array
    const mappedCases = testCase.map((tc) =>
      {
        const newTestCase: KyselyNewTestCase = {
          id: tc.id,
          title: tc.title,
          body: tc.description,
          expected_result: tc.expectedResult,
          status: tc.status,
          version: tc.version,
          pre_conditions: tc.preconditions,
          steps: tc.steps,
          priority: tc.priority,
          actual_result: tc.actualResult,
          execution_status: tc.executionStatus,
          test_case_id: tc.testCaseId,
          project_id: tc.projectId,
          suite_id: tc.suiteId,
          category_id: tc.categoryId,
        }
      return newTestCase;
    });

    //Create a transaction to save test cases - (Get project - update the seq table from project - then save the test case)
    return await this.db.transaction().execute(async (trx) => {
      await trx.insertInto('test_cases')
        .values(mappedCases).returningAll().executeTakeFirst();

      await trx.updateTable('test_projects')
        .set({ last_project_code_number: sequence })
        .where('id', '=', testCase[0].projectId)
        .executeTakeFirstOrThrow();
    });
  }

  async getById(id: string): Promise<TestCase | null> {
    //to be implemented
    const row: KyselyATestCase | undefined = await this.db.selectFrom('test_cases').selectAll()
      .where('id', '=', id).executeTakeFirst();

    return row ? toTestCase(row) : null;
  }

  async listAll(): Promise<TestCase[]> {
    //to be implemented
    const rows: KyselyATestCase[] = await this.db.selectFrom('test_cases').selectAll().execute();

    return rows.map(toTestCase);
  }

  async edit(updates: KyselyUpdateTestCase): Promise<TestCase | null> {
    const { id, ...updateData } = updates;

    const row = await this.db.updateTable('test_cases').set({
      ...updateData,
      version: sql`version + 1`,
      updated_at: sql`now()`,
    })
      .where('id', '=', id!).returningAll().executeTakeFirst();

    return row ? toTestCase(row) : null;
  }

  async getProjectCodeAndSequence(projectId: string): Promise<{ projectCode: string; sequence: number }> {
    //Get the project by its project id from the projects table
    const row = await this.db.selectFrom('test_projects')
      .select(['project_code', 'last_project_code_number'])
      .where('id', '=', projectId)
      .executeTakeFirst();

    if (!row) throw new NotFoundError('Project not found');

    return { projectCode: row.project_code, sequence: row.last_project_code_number };
  }
}
