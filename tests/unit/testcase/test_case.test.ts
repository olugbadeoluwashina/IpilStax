import { assertEquals, assertExists } from '@std/assert';
import { expect } from '@std/expect';
import { assertSpyCalls, spy } from '@std/testing/mock';
import { CreateTestCaseUC } from '@ipinstaq/core/logic/test_case/create_test_case.ts';
import { createTestCaseFactory, fakeTestCaseRepo, MockTestCaseRepository } from './helpers.ts';
import { GetTestCaseUC } from '@ipinstaq/core/logic/test_case/get_test_case.ts';
import { ListAllTestCaseUC } from '@ipinstaq/core/logic/test_case/list_all_test_case.ts';
import { EditTestCaseUC } from '@ipinstaq/core/logic/test_case/edit_test_case.ts';

Deno.test('CreateTestCaseUseCase: should successfully be able to create one new test case', async () => {
  // 1. Setup (Arrange)
  const useCase = new CreateTestCaseUC(fakeTestCaseRepo());

  const inputData = {
    title: 'Verify User Login',
    description: '1. Enter credentials, 2. Click login',
    expectedResult: 'User is redirected to dashboard',
    status: 'draft' as const,
    projectId: 'project-id',
  };

  // 2. Execute (Act)
  const result = await useCase.execute(inputData);

  // 3. Verify (Assert)
  assertExists(result.id); // Check that a UUID was generated
  assertEquals(result.version, 1);
});

Deno.test('CreateTestCaseUseCase: should be able to create multiple test cases at once', async () => {
  const useCase = new CreateTestCaseUC(fakeTestCaseRepo());

  const inputData = [
    {
      title: 'Verify User Login',
      description: '1. Enter credentials, 2. Click login',
      status: 'draft' as const,
      projectId: 'project-id',
    }, 
    {
      title: 'Second test case',
      description: 'Make it a case for this',
      status: 'draft' as const,
      projectId: 'project-id',
    }]

    const result = await useCase.execute(inputData);

    assertExists(result.id);
    expect(result.title).toEqual(inputData[0].title)
    
})

Deno.test('CreateTestCaseUseCase: should generate test case id successfully', async () => {
  const mockrepo = fakeTestCaseRepo();
  mockrepo.getProjectCodeAndSequence = () => Promise.resolve({ projectCode: 'TEST', sequence: 2 });

  const useCase = new CreateTestCaseUC(mockrepo);
  const testCase = await useCase.execute(createTestCaseFactory());

  expect(testCase.testCaseId).toBeTruthy();
  expect(testCase.testCaseId).toEqual('TEST-3');
});

Deno.test('CreateTestCaseUseCase: should update project sequence successfully when test case is created', async (test) => {
  const mockrepo = new MockTestCaseRepository();
  mockrepo.getProjectCodeAndSequence = () =>
    Promise.resolve({ projectCode: 'TESTAQ', sequence: 3 });

  const useCase = new CreateTestCaseUC(mockrepo);
  const spied = spy(mockrepo, 'getProjectCodeAndSequence');
  let testCase = await useCase.execute(createTestCaseFactory());

  await test.step('verify the getProjectCodeAndSequence is called', () => {
    assertSpyCalls(spied, 1);
  });

  await test.step('verify the sequence for the project is updated by one', () => {
    const sequence = mockrepo.sequenceSet.get('project-id')?.seq;
    expect(sequence).toBeGreaterThan(0);
  });

  await test.step('verify testcase id is sequential', async () => {
    let i = mockrepo.sequenceSet.get('project-id')?.seq || 0;

    while (i <= 4) {
      expect(testCase.testCaseId).toBe('TESTAQ-' + i);
      testCase = await useCase.execute(createTestCaseFactory());
      i += 1;
    }
  });
});

Deno.test('CreateTestCaseUseCase: should generate test case id for different projects successfully', async () => {
  const mockrepo = fakeTestCaseRepo();
  mockrepo.getProjectCodeAndSequence = async (projectId: string) => {
    if (projectId === 'project-a') {
      return { projectCode: 'PROJA', sequence: 0 };
    }
    if (projectId === 'project-b') {
      return { projectCode: 'PROJB', sequence: 5 };
    }
    return { projectCode: 'OTHER', sequence: 0 };
  };

  const useCase = new CreateTestCaseUC(mockrepo);
  const testCaseA = await useCase.execute(createTestCaseFactory({ projectId: 'project-a' }));
  const testCaseB = await useCase.execute(createTestCaseFactory({ projectId: 'project-b' }));

  expect(testCaseA.testCaseId).toBe('PROJA-1');
  expect(testCaseB.testCaseId).toBe('PROJB-6');
});

Deno.test('CreateTestCaseUseCase: should return an empty array instantly if input batch is empty', async () => {
  const mockrepo = fakeTestCaseRepo();
  const spied = spy(mockrepo, 'getProjectCodeAndSequence');
  const useCase = new CreateTestCaseUC(mockrepo);

  const result = await useCase.execute([]);

  expect(result).toEqual([]);
  assertSpyCalls(spied, 0); // Proves the database wasn't touched unnecessarily
});

/** ************** */

Deno.test('GetTestCaseUseCase: should get test case by id after creation', async (test) => {
  const repo = fakeTestCaseRepo();

  await test.step('can retrieve existing test case', async () => {
    await repo.save(
      createTestCaseFactory({
        id: 'existing-id-123',
        title: 'Verify User Logout',
      }), 3);

    const getUseCase = new GetTestCaseUC(repo);
    const retrievedTestCase = await getUseCase.execute('existing-id-123');
    expect(retrievedTestCase).toBeDefined();
    expect(retrievedTestCase?.title).toBe('Verify User Logout');
  });

  await test.step('return null for non-existing test case', async () => {
    const getUseCase = new GetTestCaseUC(repo);
    const result = await getUseCase.execute('non-existing-id');
    expect(result).toBeNull();
  });
});

Deno.test('ListAllTestCaseUC should list all test cases', async (test) => {
  const repo = fakeTestCaseRepo();

  await test.step('should return empty array when no test cases exist', async () => {
    const listUseCase = new ListAllTestCaseUC(repo);
    const allTestCases = await listUseCase.execute();
    expect(allTestCases.length).toBe(0);
  });

  await test.step('should return all test cases when they exist', async () => {
    // Seed with some test cases
    repo.listAll = () =>
      Promise.resolve([
        createTestCaseFactory({
          id: 'id-1',
          title: 'Test Case 1',
        }),
        createTestCaseFactory({
          id: 'id-2',
          title: 'Test Case 2',
        }),
      ]);

    const listUseCase = new ListAllTestCaseUC(repo);
    const allTestCases = await listUseCase.execute();

    expect(allTestCases.length).toBe(2);
  });
});

Deno.test('EditTestCaseUC should edit existing test case', async () => {
  const repo = fakeTestCaseRepo();

  // Seed with a test case
  await repo.save(
    createTestCaseFactory({
      id: 'id-to-edit',
      title: 'Original Title',
    }),
    3,
  );

  const editUseCase = new EditTestCaseUC(repo);

  const updates = {
    id: 'id-to-edit',
    title: 'Updated Title',
  };

  const updatedTestCase = await editUseCase.execute(updates);

  expect(updatedTestCase).toBeDefined();
  expect(updatedTestCase?.title).toBe(updates.title);
  expect(updatedTestCase?.version).toBe(2);
});
