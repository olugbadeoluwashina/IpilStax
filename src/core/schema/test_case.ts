import { z } from 'zod';

export const TestCaseStatusSchema = z.enum({
  draft: 'draft',
  active: 'active',
  archived: 'archived',
});

const BaseTestCaseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description is too short"),
  expectedResult: z.string().min(10, "Expected result is required"),
  status: TestCaseStatusSchema,
  projectId: z.uuid(),
});

// 2. Schema for CREATING a Test Case (No IDs allowed from the user)
export const CreateTestCaseSchema = BaseTestCaseSchema;

// 3. Schema for the DOMAIN / DATABASE (Includes the metadata)
export const TestCaseSchema = BaseTestCaseSchema.extend({
  id: z.uuid(),
  testCaseId: z.string().min(1, "Test Case ID is required").max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive().default(1),
});

