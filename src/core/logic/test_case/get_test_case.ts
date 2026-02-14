import type { TestCase } from '../../schema/test_case.ts';
import type { ITestCaseRepository } from './test_case_repo.ts';

export class GetTestCaseUC {
  constructor(private repo: ITestCaseRepository) {}

  async execute(id: string): Promise<TestCase | null>{
    const testCase = await this.repo.getById(id);
    return testCase;
  }
}