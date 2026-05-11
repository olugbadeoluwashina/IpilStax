import { expect } from '@std/expect/expect';
import { createTestProjectFactory, fakeProjectRepo } from './fake_project_repo.ts';
import { CreateProjectUseCase } from '@ipinstaq/core/logic/test_project/create_test_project.ts';
import { ProjectCodeGenerator } from '@ipinstaq/core/logic/test_project/project_code_generator.ts';

Deno.test('CREATEPROJECTUC: test project can be created successfully', async () => {
  const repo = fakeProjectRepo();
  const projectUsecase = new CreateProjectUseCase(repo);
  const project = await projectUsecase.execute({
    name: 'Test Project',
    description: 'A project for testing',
  });

  expect(project?.id).toBeTruthy();
});

Deno.test('CREATEPROJECTUC: should return the available project code', async () => {
  const repo = fakeProjectRepo();
  repo.create(
    createTestProjectFactory({ id: 'project-id', name: 'Test Project', projectCode: 'TESPROJ' }),
  );
  const projectUsecase = new CreateProjectUseCase(repo);
  const result = await projectUsecase.execute({ name: 'Test Projects' });

  expect(result?.projectCode).toBe('TESPROJT');
});

Deno.test('CREATEPROJECTUC: should not allow duplicate project names', async () => {
  const repo = fakeProjectRepo();
  repo.create(
    createTestProjectFactory({ id: 'project-id', name: 'Test Project', projectCode: 'TESPROJ' }),
  );

  const projectUsecase = new CreateProjectUseCase(repo);
  const result = await projectUsecase.execute({ name: 'Test Project' });

  expect(result).toBeUndefined();
});

Deno.test('PROJECTCODE: project code generator handles all scenarios', () => {
  expect(ProjectCodeGenerator.generate('Internal Tools')).toStrictEqual('INTTOOL');
  expect(ProjectCodeGenerator.generate('Internal')).toStrictEqual('INTERN');
  expect(ProjectCodeGenerator.generate('Internal Tools Management')).toStrictEqual('INTTOOL');
  expect(ProjectCodeGenerator.generate('Inter%nal-Tools!')).toStrictEqual('INTERN');
  expect(ProjectCodeGenerator.generate('Alpha Beae')).toStrictEqual('ALPB');
});

// Deno.test("test project can be retrieved successfully", async () => {
//   console.log("Project retrieval logic goes here");

//   const project: any = save();
//   expect(project).toBeDefined();
// });
