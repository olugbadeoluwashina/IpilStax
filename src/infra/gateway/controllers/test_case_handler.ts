import { CreateTestCaseUC } from '@ipinstaq/core/logic/test_case/create_test_case.ts';
import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';
import { GetTestCaseUC } from '@ipinstaq/core/logic/test_case/get_test_case.ts';
import { ListAllTestCaseUC } from '@ipinstaq/core/logic/test_case/list_all_test_case.ts';

export async function createTestCaseHandler(data: TestCase, repo: ITestCaseRepository): Promise<Response> {
  console.log('createTestCaseHandler');
  const uc = new CreateTestCaseUC(repo);
  const result = await uc.execute(data);

  return Response.json({
    success: true,
    data: result,
  }, { status: 201 });
}

export async function getTestCaseHandler(id: string, repo: ITestCaseRepository) {
  const uc = new GetTestCaseUC(repo);
  const result = await uc.execute(id);

  return Response.json({
    success: true,
    data: result,
  });
}

export async function listAllTestCasesHandler(repo: ITestCaseRepository): Promise<Response> {
  const uc = new ListAllTestCaseUC(repo);
  const result = await uc.execute();

  return Response.json({
    success: true,
    data: result,
  });
}