// We use the Mock for now so the app is "runnable" without Postgres
import { loggerMiddleware } from '@ipinstaq/infra/gateway/middleware/logger_middleware.ts';
import { errorMiddleware } from '@ipinstaq/infra/gateway/middleware/error_middleware.ts';
import router from '@ipinstaq/infra/gateway/routers/router.ts';
import { defineDependencies } from '@ipinstaq/shared/types/deps.ts';

// configure dependencies
const deps = defineDependencies();

console.log('Ipinstaq Gateway starting on http://localhost:8000');

Deno.serve(async (req: Request) => {
  return await loggerMiddleware(req, async () => {
    return await errorMiddleware(req, async () => {
      return await router(req, deps);
    });
  });
});
