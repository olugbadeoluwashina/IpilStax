import { assertEquals, assertExists } from '@std/assert';
import { expect } from '@std/expect'
import { CreateTestCaseUC } from '@ipinstaq/core/logic/test_case/create_test_case.ts';
import { fakeTestCaseRepo } from '../helpers.ts';
import { GetTestCaseUC } from '@ipinstaq/core/logic/test_case/get_test_case.ts';
import { ListAllTestCaseUC } from '@ipinstaq/core/logic/test_case/list_all_test_case.ts';


Deno.test('CreateTestCaseUseCase: should successfully create a new test case', async () => {
  // 1. Setup (Arrange)
  const useCase = new CreateTestCaseUC(fakeTestCaseRepo());

  const inputData = {
    title: 'Verify User Login',
    description: '1. Enter credentials, 2. Click login',
    expectedResult: 'User is redirected to dashboard',
    status: 'draft' as const,
  };

  // 2. Execute (Act)
  const result = await useCase.execute(inputData);

  // 3. Verify (Assert)
  assertExists(result.id); // Check that a UUID was generated
  assertEquals(result.version, 1);
});

Deno.test('GetTestCaseUseCase: should get test case by id after creation', async (test) => {
  const repo = fakeTestCaseRepo();

  await test.step('can retrieve existing test case', async () => {
    await repo.save({
      id: 'existing-id-123',
      title: 'Verify User Logout',
      description: '1. Click logout button',
      expectedResult: 'User is redirected to login page',
      status: 'draft' as const,
    });

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

Deno.test("ListAllTestCaseUC should list all test cases", async (test) => {

  const repo = fakeTestCaseRepo();

  await test.step("should return empty array when no test cases exist", async () => {
    const listUseCase = new ListAllTestCaseUC(repo);
    const allTestCases = await listUseCase.execute();
    expect(allTestCases.length).toBe(0);
  });

  await test.step("should return all test cases when they exist", async () => {

  // Seed with some test cases
  repo.listAll = () => Promise.resolve([
    {
      id: 'id-1',
      title: 'Test Case 1',
      description: 'Description 1',
      expectedResult: 'Expected Result 1',
      status: 'active' as const,
    },
    {
      id: 'id-2',
      title: 'Test Case 2',
      description: 'Description 2',
      expectedResult: 'Expected Result 2',
      status: 'draft' as const,
    },
  ]);

  const listUseCase = new ListAllTestCaseUC(repo);
  const allTestCases = await listUseCase.execute();

  expect(allTestCases.length).toBe(2);
  });

});
