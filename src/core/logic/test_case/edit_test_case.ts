import type { TestCase } from '../../schema/test_case.ts';
import type { ITestCaseRepository, UpdateTestCaseInput } from './test_case_repo.ts';

export class EditTestCaseUC {
  constructor(private repo: ITestCaseRepository) {}

  async execute( updates: UpdateTestCaseInput): Promise<TestCase | null> {
    const existingTestCase = await this.repo.getById(updates.id);
    
    if (!existingTestCase) {
      return null; 
    }

    const testCase = await this.repo.edit(updates);
    return testCase;
  }
}