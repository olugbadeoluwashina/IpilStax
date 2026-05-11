import { expect } from '@std/expect';
import { TestDepsBuilder } from '../../builder/apps_deps.builder.ts';
import type { TestCaseAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import {
  getTestCaseHandler,
  listAllTestCasesHandler,
} from '@ipinstaq/infra/gateway/controllers/test_case_handler.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import type { AppRequest } from '@ipinstaq/infra/gateway/middleware/validation_middleware.ts';
import { createTestCaseFactory } from './helpers.ts';

Deno.test('handler throws error when test case is not found', () => {
  const req = { validated: '124' } as AppRequest;

  const deps: TestCaseAppDependencies = new TestDepsBuilder()
    .withGetTestCaseUC({
      execute: () => Promise.resolve(null),
    })
    .build();

  expect(getTestCaseHandler(req, deps)).rejects.toThrow(NotFoundError);
});

Deno.test('handler returns test case when found', async () => {
  const deps: TestCaseAppDependencies = new TestDepsBuilder()
    .withGetTestCaseUC({
      execute: (req: string) => {
        if (req) return Promise.resolve(createTestCaseFactory({ id: req, title: 'Test Case 123' }));
        else return Promise.resolve(null);
      },
    })
    .build();

  const req = { validated: '123' } as AppRequest;

  const res = await getTestCaseHandler(req, deps);
  const resData = await res.json();

  expect(res.status).toBe(200);
  expect(resData.data.id).toBe('123');
  expect(resData.data.title).toBe('Test Case 123');
});

Deno.test('handler returns empty list when there are no test cases', async () => {
  const deps: TestCaseAppDependencies = new TestDepsBuilder().build();
  const req = {} as AppRequest;

  const res = await listAllTestCasesHandler(req, deps);

  const resData = await res.json();

  expect(res.status).toBe(200);
  expect(resData.data).toBeInstanceOf(Array);
});
