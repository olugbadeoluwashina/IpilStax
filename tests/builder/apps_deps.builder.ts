import type { AppDependencies, GetTestCaseUCContract, TestCaseAppDependencies, TestProjectAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import type { TestCase } from '@ipinstaq/shared/types/types.ts';

export class TestDepsBuilder {
  private readonly deps: TestCaseAppDependencies

  constructor() {

    this.deps = {
      
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
  private readonly deps: TestProjectAppDependencies;

  constructor() {

    this.deps = {
      createProjectUC: {
        execute: async (input) => {
          throw new Error("createProjectUC.execute not implemented in TestProjectBuilder"); }
      }
    }
    
  }

  build() {
    return this.deps;
  }
}

export class AppDepsBuilder {
  private testBuilder = new TestDepsBuilder();
  private projectBuilder = new TestProjectBuilder();

  build(): AppDependencies {
    return {
      ...this.testBuilder.build(),
      ...this.projectBuilder.build(),
    };
  }
}