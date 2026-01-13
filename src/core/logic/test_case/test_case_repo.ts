import type { TestCase, TestCaseId } from "@ipinstaq/core/schema/test_case.ts";

/**
 * This is an interface (a contract).
 * It tells the system: "I don't care HOW you save it, 
 * but you must provide these methods."
 */
export interface ITestCaseRepository {
  getById(id: TestCaseId): Promise<TestCase | null>;
  save(testCase: TestCase): Promise<void>;
  listAll(): Promise<TestCase[]>;
}