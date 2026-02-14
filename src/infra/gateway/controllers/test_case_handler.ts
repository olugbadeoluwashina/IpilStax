import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';
import type { AppDependencies } from '@ipinstaq/shared/types/deps.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import type { AppRequest } from '../middleware/validation_middleware.ts';

export async function createTestCaseHandler(req: AppRequest, deps: AppDependencies): Promise<Response> {
  console.log('createTestCaseHandler');
  const result = await deps.createTestCaseUC.execute(req.validated as TestCase);

  return Response.json({
    success: true,
    data: result,
  }, { status: 201 });
}

export async function getTestCaseHandler(req: AppRequest, deps: AppDependencies) {

  const id = req.validated as string;
  if (!id) {
    throw new NotFoundError("Missing test case id");
  }

  const result = await deps.getTestCaseUC.execute(id);

  if (!result) {
    throw new NotFoundError(`Test case with id ${id}`);
  }

  return Response.json({
    success: true,
    data: result,
  });
}

export async function listAllTestCasesHandler(_req: AppRequest, deps: AppDependencies): Promise<Response> {
  const result = await deps.listAllTestCaseUC.execute();

  return Response.json({
    success: true,
    data: result,
  });
}