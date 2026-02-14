import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import { createTestCaseRepository } from '@ipinstaq/infra/persistence/connection.ts';
import { GetTestCaseUC } from '@ipinstaq/core/logic/test_case/get_test_case.ts';
import { CreateTestCaseUC } from '@ipinstaq/core/logic/test_case/create_test_case.ts';
import { ListAllTestCaseUC } from '@ipinstaq/core/logic/test_case/list_all_test_case.ts';
import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';

export interface AppDependencies {
  testCaseRepo: ITestCaseRepository;
  getTestCaseUC: GetTestCaseUCContract;
  createTestCaseUC: CreateTestCaseUCContract;
  listAllTestCaseUC: ListAllTestCaseUCContract;
}

export function defineDependencies(): AppDependencies {
  const testCaseRepo = createTestCaseRepository();

  return {
    testCaseRepo: testCaseRepo,
    getTestCaseUC: new GetTestCaseUC(testCaseRepo),
    createTestCaseUC: new CreateTestCaseUC(testCaseRepo),
    listAllTestCaseUC: new ListAllTestCaseUC(testCaseRepo),
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
