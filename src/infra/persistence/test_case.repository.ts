import type { ITestCaseRepository} from '@ipinstaq/core/logic/test_case/test_case_repo.ts';

import { sql, type Kysely } from 'kysely';
import type { Database } from './db_schema.ts';
import type { KyselyATestCase, KyselyNewTestCase, KyselyUpdateTestCase, TestCase, TestProject } from '@ipinstaq/shared/types/types.ts';
import { toTestCase } from '@ipinstaq/shared/helpers/type_mappers.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';

export class TestCaseRepository implements ITestCaseRepository {
  constructor(private db: Kysely<Database>) {}

  async save(testCase: TestCase): Promise<void> {
    const newTestCase: KyselyNewTestCase = {
      title: testCase.title,
      body: testCase.description,
      expected_result: testCase.expectedResult,
      status: testCase.status
    };

    //Create a transaction to save test cases - (Get project - update the seq table from project - then save the test case)
    return await this.db.transaction().execute(async (trx) => {
      await trx.insertInto('test_cases')
        .values(newTestCase).returningAll().executeTakeFirst();
      
      await trx.updateTable('test_projects')
        .set({last_project_code_number: sql`last_project_code_number + 1`})
        .where('id', '=', testCase.projectId)
        .executeTakeFirstOrThrow();
      
    })
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
    
    const row =
      await this.db.updateTable("test_cases").set({...updateData, version: sql`version + 1`, updated_at: sql`now()`})
      .where("id", "=", id! ).returningAll().executeTakeFirst();

    return row ? toTestCase(row) : null;
  }

  async getProjectCodeAndSequence(projectId: string): Promise<{projectCode: string, sequence: number}> {
    //Get the project by its project id from the projects table
    const row = await this.db.selectFrom('test_projects')
      .select(['project_code', 'last_project_code_number'])
      .where('id', '=', projectId)
      .executeTakeFirst();

    if(!row) throw new NotFoundError('Project not found');

    return {projectCode: row.project_code, sequence: row.last_project_code_number};
  }
}
