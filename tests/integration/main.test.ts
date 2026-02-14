import { errorMiddleware } from '@ipinstaq/infra/gateway/middleware/error_middleware.ts';
import { TestDepsBuilder } from '../builder/apps_deps.builder.ts';
import router from '@ipinstaq/infra/gateway/routers/router.ts';
import { expect } from '@std/expect/expect';

Deno.test('Router: validate router returns 404 when route is not found', async () => {
  const req = new Request('http://localhost:8000/testCased');
  const deps = new TestDepsBuilder().build();

  const res = await errorMiddleware(req, () => router(req, deps));
  expect(res.status).toBe(404);
});

Deno.test('Router: validate router returns 404 when method is not allowed', async () => {
  const req = new Request('http://localhost:8000/testCases/123', { method: 'POST' });
  const deps = new TestDepsBuilder().build();

  const res = await errorMiddleware(req, () => router(req, deps));
  expect(res.status).toBe(404);
});

Deno.test('Router: validate router returns 200 when route is found', async () => {
  const req = new Request('http://localhost:8000/testCases', { method: 'GET' });
  const deps = new TestDepsBuilder().build();

  const res = await errorMiddleware(req, () => router(req, deps));
  console.log(await res.json());
  expect(res.status).toBe(200);
});

Deno.test('Router: validate router returns 400 when validation fails', async () => {
  const req = new Request('http://localhost:8000/testCases/invalid-uuid', { method: 'GET' });
  const deps = new TestDepsBuilder().build();

  const res = await errorMiddleware(req, () => router(req, deps));
  expect(res.status).toBe(400);
});

Deno.test('Router: /testCases/:id returns 404 when test case not found', async () => {
  const req = new Request('http://localhost:8000/testCases/123e4567-e89b-12d3-a456-426614174000', { method: 'GET' });
  const deps = new TestDepsBuilder().build();

  const res = await errorMiddleware(req, () => router(req, deps));
  expect(res.status).toBe(404);
});