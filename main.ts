import { createTestCaseHandler } from "@ipinstaq/infra/gateway/test_case_handler.ts";
// We use the Mock for now so the app is "runnable" without Postgres
import { MockTestCaseRepository } from "./tests/create_test_case.test.ts"; 
import { loggerMiddleware } from '@ipinstaq/infra/gateway/logger_middleware.ts';
import { errorMiddleware } from '@ipinstaq/infra/gateway/error_middleware.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import { validate } from '@ipinstaq/infra/gateway/validation_middleware.ts';
import  { TestCaseSchema } from '@ipinstaq/core/schema/test_case.ts';
// import { validate } from '@ipinstaq/infra/gateway/validation_middleware.ts';

// Initialize our "Memory"
const testCaseRepo = new MockTestCaseRepository();

console.log("Ipinstaq Gateway starting on http://localhost:8000");

Deno.serve(async (req: Request) => {

  return await loggerMiddleware(req, async () => {
    return await errorMiddleware(req, async () => {
      const url = new URL(req.url);

      // Simple Routing Logic
      if (req.method === "POST" && url.pathname === "/test-cases") {
        return await validate(TestCaseSchema)(req, async (data) => {
          return await createTestCaseHandler(data, testCaseRepo);
        });
      }

      // 404 Fallback
      throw new NotFoundError(`Route ${req.method} ${url.pathname}`);
    });
  });

});