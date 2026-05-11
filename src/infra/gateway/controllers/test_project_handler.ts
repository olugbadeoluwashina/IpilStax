import type { TestProjectAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import type { AppRequest } from '../middleware/validation_middleware.ts';
import type { TestProjectInput } from '@ipinstaq/shared/types/types.ts';
import { DuplicateError } from '@ipinstaq/shared/errors.ts';

export async function createProjectHandler(
  req: AppRequest<TestProjectInput>,
  deps: TestProjectAppDependencies,
): Promise<Response> {
  const result = await deps.createProjectUC.execute(req.validated);

  if (!result) throw new DuplicateError(`The project name ${req.validated.name}`);

  return Response.json(
    { success: true, data: result },
    { status: 201 },
  );
}
