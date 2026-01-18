// We use the Mock for now so the app is "runnable" without Postgres
import { loggerMiddleware } from '@ipinstaq/infra/gateway/middleware/logger_middleware.ts';
import { errorMiddleware } from '@ipinstaq/infra/gateway/middleware/error_middleware.ts';
import router from '@ipinstaq/infra/gateway/routers/router.ts';
import { TestCaseRepository } from '@ipinstaq/infra/persistence/test_case.repository.ts';
import { db } from '@ipinstaq/infra/persistence/connection.ts';
// import { validate } from '@ipinstaq/infra/gateway/validation_middleware.ts';

// Initialize our "Memory"
const testCaseRepo = new TestCaseRepository(db);

console.log("Ipinstaq Gateway starting on http://localhost:8000");

Deno.serve(async (req: Request) => {

  return await loggerMiddleware(req, async () => {
    return await errorMiddleware(req, async() => {

      return await router(req, testCaseRepo)
    });
  });
});