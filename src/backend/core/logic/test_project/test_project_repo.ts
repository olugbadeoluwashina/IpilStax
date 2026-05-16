import type { TestProject } from '@ipinstaq/shared/types/types.ts';
/**
 * This is an interface (a contract).
 * It tells the system: "I don't care HOW you save it,
 * but you must provide these methods."
 */
export interface ITestProjectRepository {
  isProjectCodeAvailable(projectCode: string): Promise<boolean>;
  isProjectNameAvailable(name: string): Promise<boolean>;
  create(testProject: TestProject): Promise<void>;
}
