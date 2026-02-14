import { expect } from '@std/expect';
import { TestDepsBuilder } from '../../builder/apps_deps.builder.ts';
import type { AppDependencies } from '@ipinstaq/shared/types/deps.ts';
import { getTestCaseHandler } from '@ipinstaq/infra/gateway/controllers/test_case_handler.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import type { AppRequest } from '@ipinstaq/infra/gateway/middleware/validation_middleware.ts';

Deno.test("handler returns 404 when test case is found", () => {

  const req = {validated: '124'} as AppRequest;

  const deps: AppDependencies = new TestDepsBuilder()
    .withGetTestCaseUC({
      execute: () => Promise.resolve(null)
    })
    .build();

  expect(getTestCaseHandler(req, deps)).rejects.toThrow(NotFoundError);

});

Deno.test("handler returns test case when found", async () => {
  const deps: AppDependencies = new TestDepsBuilder()
    .withGetTestCaseUC({
      execute: () => Promise.resolve({id: "123", title: "Test Case 123", description: "A test case for testing", expectedResult: "Should work"
        , status: "active"
      })
    })
    .build();

  const req = {validated: "123"} as AppRequest;

  const res = await getTestCaseHandler(req, deps);
  const resData = await res.json();

  expect(res.status).toBe(200);
  expect(resData.data.id).toBe("123");
  expect(resData.data.title).toBe("Test Case 123");

})

