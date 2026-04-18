import type { ITestProjectRepository } from '@ipinstaq/core/logic/test_project/test_project_repo.ts';
import type { KyselyNewProject, TestProject } from '../../shared/types/types.ts';
import type { Kysely } from 'kysely';
import type { Database } from './db_schema.ts';

export class TestProjectRepository implements ITestProjectRepository {
  constructor(private db: Kysely<Database>) {}

  async isProjectCodeAvailable(projectCode: string): Promise<boolean> {
    const code = await this.db.selectFrom('test_projects').select('id').where('project_code', '=', projectCode).executeTakeFirst();
    return code ? false : true;
  }

  async isProjectNameAvailable(name: string): Promise<boolean> {
    const project = await this.db.selectFrom('test_projects').select('id').where('name', '=', name).executeTakeFirst();
    return project ? false: true;
  }

  async create(testProject: TestProject): Promise<void> {
    const newProject: KyselyNewProject = {
      id: testProject.id,
      name: testProject.name,
      project_code: testProject.projectCode,
      description: testProject.description,
      created_at: testProject.createdAt,
      updated_at: testProject.updatedAt,
      last_project_code_number: 0
    } 

    await this.db.insertInto('test_projects').values(newProject).execute();
  }

}