import type { CreateTestCaseInput, TestCase } from '@ipinstaq/shared/types/types.ts';
import type { ITestCaseRepository } from './test_case_repo.ts';

export class CreateTestCaseUC {
  constructor(private repo: ITestCaseRepository) {}

  async execute(data: CreateTestCaseInput): Promise<TestCase> {

    const newTestCase: TestCase = {
      ...data,
      id: crypto.randomUUID(), // Standard Web API available in Deno
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repo.save(newTestCase);
    console.log(newTestCase)
    return newTestCase;
  }
}
