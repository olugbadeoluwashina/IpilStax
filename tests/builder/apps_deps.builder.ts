import type { GetTestCaseUCContract, TestCaseAppDependencies, TestProjectAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import { fakeTestCaseRepo } from '../unit/testcase/helpers.ts';
import type { TestCase } from '@ipinstaq/shared/types/types.ts';

export class TestDepsBuilder {

  private readonly deps: TestCaseAppDependencies;
  
  constructor() {
    const repo = fakeTestCaseRepo();

    this.deps = {
      testCaseRepo: repo,
      getTestCaseUC: {
        execute: (id: string) => Promise.resolve(null)
      },
      createTestCaseUC: {
        execute: async (input: TestCase) => {
          throw new Error("createTestCaseUC.execute not implemented in TestDepsBuilder"); }
      },
      listAllTestCaseUC: {
        execute: () => Promise.resolve([])
      },
      editTestCaseUC: {
        execute: async (updates) => {
          throw new Error("editTestCaseUC.execute not implemented in TestDepsBuilder"); }
      },
    };

  }

  withGetTestCaseUC(impl: GetTestCaseUCContract): this {
    this.deps.getTestCaseUC = impl;
    return this;
  }

  build(): TestCaseAppDependencies {
    return this.deps;
  }

}

export class TestProjectBuilder {

  constructor(private readonly deps: TestProjectAppDependencies) {
    
  }

  build() {
    return this.deps;
  }
}