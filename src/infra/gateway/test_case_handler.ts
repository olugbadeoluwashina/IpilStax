import { CreateTestCaseUC } from "@ipinstaq/core/logic/test_case/create_test_case.ts";
import type { ITestCaseRepository } from "@ipinstaq/core/logic/test_case/test_case_repo.ts";
import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';

export async function createTestCaseHandler(data: TestCase, repo: ITestCaseRepository):Promise<Response> {
  console.log("createTestCaseHandler");
  const uc = new CreateTestCaseUC(repo);
  const result = await uc.execute(data);

  return Response.json({
    success: true,
    data: result,
  }, { status: 201 });
}