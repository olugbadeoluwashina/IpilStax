import type { TestCase } from '@ipinstaq/shared/types/types.ts';
import type { TestCaseAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import type { AppRequest } from '../middleware/validation_middleware.ts';
import type { UpdateTestCaseInput } from '@ipinstaq/shared/types/types.ts';
import { sendSuccessResponse } from '@ipinstaq/shared/helpers/response.ts';

export async function createTestCaseHandler(req: AppRequest, deps: TestCaseAppDependencies): Promise<Response> {
  const result = await deps.createTestCaseUC.execute(req.validated as TestCase)

  return Response.json({
    success: true,
    data: result,
  }, { status: 201 });
}

export async function getTestCaseHandler(req: AppRequest, deps: TestCaseAppDependencies) {

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

export async function listAllTestCasesHandler(_req: AppRequest, deps: TestCaseAppDependencies): Promise<Response> {
  const result = await deps.listAllTestCaseUC.execute();

  return Response.json(sendSuccessResponse(result))
}

export async function editTestCaseHandler(req: AppRequest, deps: TestCaseAppDependencies): Promise<Response> {
  const updates = req.validated as UpdateTestCaseInput;

  const result = await deps.editTestCaseUC?.execute(updates);

  if (!result) {
    throw new NotFoundError(`Test case with id ${updates.id}`);
  }

  return Response.json({
    success: true,
    data: result,
  });
}