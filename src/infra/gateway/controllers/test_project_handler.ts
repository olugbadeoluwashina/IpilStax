import type { TestProjectAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import type { AppRequest } from '../middleware/validation_middleware.ts';
import type { TestProject } from '@ipinstaq/shared/types/types.ts';
import { DuplicateError } from '@ipinstaq/shared/errors.ts';

export async function createProjectHandler(req: AppRequest, deps: TestProjectAppDependencies): Promise<Response> {
    const result = await deps.createProjectUC.execute(req.validated as TestProject);

    if(!result) throw new DuplicateError(`The project name ${req.validated}`);

    return Response.json(
        {success: true, 
        data: result}, {status: 201}
    );
}   
    