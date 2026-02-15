import type { AppDependencies, GetTestCaseUCContract } from '@ipinstaq/shared/types/deps.ts';
import { fakeTestCaseRepo } from '../helpers.ts';
import { TestCase } from '@ipinstaq/shared/types/types.ts';

export class TestDepsBuilder {

  private readonly deps: AppDependencies;
  
  constructor() {
    const repo = fakeTestCaseRepo();

    this.deps = {
      testCaseRepo: repo,
      getTestCaseUC: {
        execute: () => Promise.resolve(null)
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

  build(): AppDependencies {
    return this.deps;
  }

}