import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';

/**
 * This is a Mock Repository.
 * It stays in RAM and never touches the disk.
 */
export class MockTestCaseRepository implements ITestCaseRepository {
  public testCases: TestCase[] = [];

  async save(testCase: TestCase) {
    await Promise.resolve(this.testCases.push(testCase));
  }

  async getById(id: string): Promise<TestCase | null> {
    console.log("DEBUG - MockTestCaseRepository.getById called with id:", id);
    return this.testCases.find((tc) => tc.id === id) || null;
  }

  async listAll(): Promise<TestCase[]> {
    return this.testCases;
  }

  async edit(updates: Partial<TestCase>): Promise<TestCase | null> {
    const index = this.testCases.findIndex((tc) => tc.id === updates.id);
    if (index === -1) {
      return null;
    }

    this.testCases[index] = { ...this.testCases[index], ...updates };
    return this.testCases[index];
  }
}

export function fakeTestCaseRepo(): ITestCaseRepository {
  return new MockTestCaseRepository();
}


// function silentLogger(): AppDependencies['logger'] {
//     return {
//         info: async (_msg: string) => Promise.resolve(),
//         error: async (_msg: string) => Promise.resolve(),
//         debug: async (_msg: string) => Promise.resolve(),
//     };
// }