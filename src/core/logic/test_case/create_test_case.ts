import type { CreateTestCaseInput, TestCase } from '@ipinstaq/shared/types/types.ts';
import type { ITestCaseRepository } from './test_case_repo.ts';

export class CreateTestCaseUC {
  constructor(private repo: ITestCaseRepository) {}

  async execute(data: CreateTestCaseInput): Promise<TestCase> {

    const project = await this.repo.getProjectCodeAndSequence(data.projectId);

    const testCaseId = `${project.projectCode}-${project.sequence+1}`

    const newTestCase = {...data,
      id: crypto.randomUUID(), // Standard Web API available in Deno
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      testCaseId
    };

    await this.repo.save(newTestCase);
    console.log(newTestCase)
    return newTestCase;
  }

}
