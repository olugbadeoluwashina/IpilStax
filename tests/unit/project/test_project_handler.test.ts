import { expect } from '@std/expect/expect';
import type { TestProjectAppDependencies } from '@ipinstaq/shared/types/deps.ts';
import { createProjectHandler } from '@ipinstaq/infra/gateway/controllers/test_project_handler.ts';
import type { AppRequest } from '@ipinstaq/infra/gateway/middleware/validation_middleware.ts';
import { createTestProjectFactory } from './fake_project_repo.ts';
import { DuplicateError } from '@ipinstaq/shared/errors.ts'
import { TestProjectInput } from '@ipinstaq/shared/types/types.ts';

Deno.test("CREATEPROJECT: test project returns 201 status code", async() => {

    const fakeCreateProjectUC =  {
        execute: () => Promise.resolve(createTestProjectFactory({
            id: "project-id",
            projectCode: "TESPROJ"
        }))
    };

    const deps: TestProjectAppDependencies = {
         createProjectUC: fakeCreateProjectUC,
    }
    
    const req = {validated: {name: "Test Project", description: "A project for testing"}} as AppRequest<TestProjectInput>

    const response = await createProjectHandler(req, deps);
    const json = await response.json();

    console.log(json)
    expect(response.status).toBe(201);
    expect(json.data).toHaveProperty("projectCode", "TESPROJ")

})

Deno.test("CREATEPROJECT: system throws error when project name already exists", async() => {
    const fakeCreateProjectUC =  {
        execute: () => Promise.resolve(undefined)
    };

    const req = {validated: {name: 'TESPROJ'}} as AppRequest<TestProjectInput>

    const deps: TestProjectAppDependencies = {
         createProjectUC: fakeCreateProjectUC,
    }
    const response = createProjectHandler(req, deps);

    expect(response).rejects.toThrow(DuplicateError)
})