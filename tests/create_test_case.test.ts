import { assertEquals, assertExists } from "@std/assert";
import { TestCase } from "@ipinstaq/core/schema/test_case.ts";
import { ITestCaseRepository } from "@ipinstaq/core/logic/test_case/test_case_repo.ts";
import { CreateTestCaseUC } from "@ipinstaq/core/logic/test_case/create_test_case.ts";

/**
 * This is a Mock Repository. 
 * It stays in RAM and never touches the disk.
 */
class MockTestCaseRepository implements ITestCaseRepository {
  public testCases: TestCase[] = [];

  async save(testCase: TestCase) {
    this.testCases.push(testCase);
  }

  async getById(id: string): Promise<TestCase | null> {
    return this.testCases.find((tc) => tc.id === id) || null;
  }

  async listAll(): Promise<TestCase[]> {
    return this.testCases;
  }
}

Deno.test("CreateTestCaseUseCase: should successfully create a new test case", async () => {
  // 1. Setup (Arrange)
  const mockRepo = new MockTestCaseRepository();
  const useCase = new CreateTestCaseUC(mockRepo);
  
  const inputData = {
    title: "Verify User Login",
    body: "1. Enter credentials, 2. Click login",
    expectedResult: "User is redirected to dashboard",
    status: "draft" as const,
  };

  // 2. Execute (Act)
  const result = await useCase.execute(inputData);

  // 3. Verify (Assert)
  assertExists(result.id); // Check that a UUID was generated
  assertEquals(result.title, inputData.title);
  assertEquals(result.version, 1);
  assertEquals(mockRepo.testCases.length, 1); // Verify it was "saved" to our mock
  assertEquals(mockRepo.testCases[0].id, result.id);
});

