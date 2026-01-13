export type TestCaseId = string;

export interface TestCase {
  id: TestCaseId;
  title: string;
  body: string;
  expectedResult: string;
  status: 'active' | 'draft' | 'archived';
  version: number;
  createdAt: Date;
}