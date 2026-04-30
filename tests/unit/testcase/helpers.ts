import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import type { TestCase, TestProject, UpdateTestCaseInput } from '@ipinstaq/shared/types/types.ts';

/**
 * This is a Mock Repository.
 * It stays in RAM and never touches the disk.
 */
export class MockTestCaseRepository implements ITestCaseRepository {
  
  public testCases: TestCase[] = [];
  sequenceSet: Map<string, {code: string,seq: number}> = new Map([['project-id', {code: 'TEST', seq: 0}]]);

  async save(testCase: TestCase) {
    //this.sequenceSet.set(testCase.projectId, (this.sequenceSet.get(testCase.id) || 0) + 1);
    await Promise.resolve(this.testCases.push(testCase));

    //update sequence after a save
    const project = this.sequenceSet.get(testCase.projectId);
    if(project) {
      project.seq += 1;
    }
  }

  async getById(id: string): Promise<TestCase | null> {
    console.log("DEBUG - MockTestCaseRepository.getById called with id:", id);
    return this.testCases.find((tc) => tc.id === id) || null;
  }

  async listAll(): Promise<TestCase[]> {
    return this.testCases;
  }

  async edit(updates: UpdateTestCaseInput): Promise<TestCase | null> {
    const index = this.testCases.findIndex((tc) => tc.id === updates.id);
    if (index === -1) {
      return null;
    }

    this.testCases[index] = { ...this.testCases[index], ...updates, 
      version: (this.testCases[index].version || 1) + 1, updatedAt: new Date() };
    return this.testCases[index];
  }

  getProjectCodeAndSequence(projectId: string)  {
    const project = this.sequenceSet.get(projectId);
    return Promise.resolve({projectCode: project?.code || 'TEST', sequence: project?.seq || 0});
  }
}

export function fakeTestCaseRepo(): ITestCaseRepository {
  return new MockTestCaseRepository();
}


export function createTestCaseFactory(overrides?: Partial<TestCase>): TestCase {
  return {
    id: 'test-case-id',
    title: 'Test Case Title',
    description: 'Test Case Description',
    expectedResult: 'Expected Result',
    status: 'draft',
    version: 1,
    testCaseId: 'test-case-id',
    projectId: 'project-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// function silentLogger(): AppDependencies['logger'] {
//     return {
//         info: async (_msg: string) => Promise.resolve(),
//         error: async (_msg: string) => Promise.resolve(),
//         debug: async (_msg: string) => Promise.resolve(),
//     };
// }