import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import { testCaseRoutes } from './test_case.router.ts';

async function router(req: Request, repo: any): Promise<Response> {
  const url = new URL(req.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const head = segments[0];
  const tail = segments.slice(1).join('/');

  switch (head) {
    case 'test-cases':
      return await testCaseRoutes(req, tail, repo as ITestCaseRepository);
    default:
      throw new NotFoundError(`Route ${req.method} ${url.pathname}`); 
  }

}

export default router;
