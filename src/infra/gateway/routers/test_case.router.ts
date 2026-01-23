import type { ITestCaseRepository } from '@ipinstaq/core/logic/test_case/test_case_repo.ts';
import { createTestCaseHandler, getTestCaseHandler, listAllTestCasesHandler } from '../controllers/test_case_handler.ts';
import { RequestValidationSchema, validate } from '../middleware/validation_middleware.ts';
import z from 'zod';

export async function testCaseRoutes (req: Request, tail: string, repo: ITestCaseRepository): Promise<Response> {
  const segments = tail.split('/').filter(Boolean);

  if (req.method === 'POST' && segments.length === 0) {
    return await validate(RequestValidationSchema)(req, async (data) => {
      return await createTestCaseHandler(data.body, repo);
    })
  }
    
  if (req.method === 'GET' && segments.length === 1) {
    
    const id = z.uuid().parse(segments[0]);
    return await getTestCaseHandler(id, repo);
  }

  if (req.method === 'GET' && segments.length === 0) {
    return await listAllTestCasesHandler(repo);
  }

    throw new Error(`Route ${req.method} /test-cases/${tail} not found`);
}