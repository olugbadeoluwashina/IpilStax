import type { AppDependencies, GetTestCaseUCContract } from '@ipinstaq/shared/types/deps.ts';
import { fakeTestCaseRepo } from '../helpers.ts';
import { TestCase } from '@ipinstaq/core/schema/test_case.ts';

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