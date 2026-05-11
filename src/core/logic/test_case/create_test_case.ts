import type { CreateTestCaseInput, TestCase } from '@ipinstaq/shared/types/types.ts';
import type { ITestCaseRepository } from './test_case_repo.ts';
import type { CreateTestCaseUCContract } from '@ipinstaq/shared/types/deps.ts';

export class CreateTestCaseUC implements CreateTestCaseUCContract {
  constructor(private repo: ITestCaseRepository) {}

  async execute(data: CreateTestCaseInput[] | CreateTestCaseInput): Promise<TestCase> {
    const inputs = Array.isArray(data) ? data : [data];

    const project = await this.repo.getProjectCodeAndSequence(inputs[0].projectId);
    const projectCode = project.projectCode;
    let sequence = project.sequence;
    const testCases: TestCase[] = [];

    for (const draft of inputs) {
      sequence += 1;
      const testCaseId = `${projectCode}-${sequence}`;

      const newTestCase = {
        ...draft,
        id: crypto.randomUUID(), // Standard Web API available in Deno
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        testCaseId,
      };

      testCases.push(newTestCase);
    }

    await this.repo.save(testCases, sequence);
    return testCases[0];
  }
}
