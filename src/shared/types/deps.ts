import type { ITestCaseRepository, UpdateTestCaseInput } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import { createTestCaseRepository } from '@ipinstaq/infra/persistence/connection.ts';
import { GetTestCaseUC } from '@ipinstaq/core/logic/test_case/get_test_case.ts';
import { CreateTestCaseUC } from '@ipinstaq/core/logic/test_case/create_test_case.ts';
import { ListAllTestCaseUC } from '@ipinstaq/core/logic/test_case/list_all_test_case.ts';
import { EditTestCaseUC } from '@ipinstaq/core/logic/test_case/edit_test_case.ts';
import type { TestCase, TestProject, TestProjectInput } from './types.ts';
import { CreateProjectUseCase } from '@ipinstaq/core/logic/test_project/create_test_project.ts';

export interface TestProjectAppDependencies {
  createProjectUC:  { execute: (input: TestProjectInput) => Promise<TestProject | undefined>; };
}

export interface TestCaseAppDependencies {
  testCaseRepo: ITestCaseRepository;
  getTestCaseUC: GetTestCaseUCContract;
  createTestCaseUC: CreateTestCaseUCContract;
  listAllTestCaseUC: ListAllTestCaseUCContract;
  editTestCaseUC: EditTestCaseUCContract;
}

export interface AppDependencies extends TestCaseAppDependencies {}

export function defineDependencies(): AppDependencies {
  const testCaseRepo = createTestCaseRepository();
  //const projectRepo = createTestProjectRepository();

  return {
    testCaseRepo: testCaseRepo,
    getTestCaseUC: new GetTestCaseUC(testCaseRepo),
    createTestCaseUC: new CreateTestCaseUC(testCaseRepo),
    listAllTestCaseUC: new ListAllTestCaseUC(testCaseRepo),
    editTestCaseUC: new EditTestCaseUC(testCaseRepo),

    //createProjectUC: new CreateProjectUseCase(projectRepo)
  };
}

export interface GetTestCaseUCContract {
  execute(id: string): Promise<TestCase | null>;
}
interface CreateTestCaseUCContract {
  execute(input: TestCase): Promise<TestCase>;
}

interface ListAllTestCaseUCContract {
  execute(): Promise<TestCase[]>;
}

interface EditTestCaseUCContract {
  execute(updates: UpdateTestCaseInput): Promise<TestCase | null>;
}
