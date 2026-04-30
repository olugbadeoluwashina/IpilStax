import type { TestCase, TestProject } from '@ipinstaq/shared/types/types.ts';

/**
 * This is an interface (a contract).
 * It tells the system: "I don't care HOW you save it,
 * but you must provide these methods."
 */
export interface ITestCaseRepository {
  getById(id: string): Promise<TestCase | null>;
  save(testCase: TestCase): Promise<void>;
  listAll(): Promise<TestCase[]>;
  edit(updates: UpdateTestCaseInput): Promise<TestCase | null>;
  getProjectCodeAndSequence(projectId: string): Promise<{projectCode: string, sequence: number}>;
}

type MutableFields = Pick< TestCase, "title" | "description" | "expectedResult" | "status">;

export type UpdateTestCaseInput =  { id: string} & Partial<MutableFields>;