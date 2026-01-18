import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import { createTestCaseHandler } from '../controllers/test_case_handler.ts';
import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import { validate } from '../middleware/validation_middleware.ts';
import { TestCaseSchema } from '@ipinstaq/core/schema/test_case.ts';

async function router(req: Request, repo: ITestCaseRepository): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  // Simple Routing Logic
    if (method === "POST" && pathname === "/test-cases") {
      return await validate(TestCaseSchema)(req, async (data) => {
        return await createTestCaseHandler(data, repo);
      });
  }

  // 404 Fallback
  throw new NotFoundError(`Route ${method} ${pathname}`);
}

export default router;