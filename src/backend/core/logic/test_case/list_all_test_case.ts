import type { TestCase } from '@ipinstaq/shared/types/types.ts';
import type { ITestCaseRepository } from './test_case_repo.ts';

export class ListAllTestCaseUC {
  constructor(private repo: ITestCaseRepository) {}

  async execute(): Promise<TestCase[]> {
    return await this.repo.listAll();
  }
}
