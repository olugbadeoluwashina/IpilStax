import type { TestCase } from "@ipinstaq/core/schema/test_case.ts";
import type { ITestCaseRepository } from "./test_case_repo.ts"

export class CreateTestCaseUC {

  constructor(private repo: ITestCaseRepository) {}

  async execute(data: Omit<TestCase, 'id' | 'version' | 'createdAt'>): Promise<TestCase> {
    const newTestCase: TestCase = {
      ...data,
      id: crypto.randomUUID(), // Standard Web API available in Deno
      version: 1,
      createdAt: new Date(),
    };

    await this.repo.save(newTestCase);
    return newTestCase;
  }
}