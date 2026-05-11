import { z } from 'zod';

export const TestCaseStatusSchema = z.enum(['draft','active','archived']);

export const TestCasePriority = {
  CRITICAL : 1,
  HIGH : 2,
  MEDIUM : 3,
  LOW : 4,
} as const;

const BaseTestCaseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description is too short'),
  preconditions: z.string().min(10, 'Preconditions is too short').optional(),
  steps: z.string().min(10, 'Steps is too short').optional(),
  expectedResult: z.string().min(10, 'Expected result is required').optional(),
  priority: z.enum(TestCasePriority).optional(),
  status: TestCaseStatusSchema,
  projectId: z.uuid('Expects a valid project uuid'),
  suiteId: z.uuid('Not a valid uuid').optional(),
  categoryId: z.uuid('Not a valid uuid').optional(),
});

export const BatchTestCaseSchema = z.object({
  data: z.array(BaseTestCaseSchema),
});


// 2. Schema for CREATING a Test Case (No IDs allowed from the user)
export const CreateTestCaseSchema = BaseTestCaseSchema;

// 3. Schema for the DOMAIN / DATABASE (Includes the metadata)
export const TestCaseSchema = BaseTestCaseSchema.extend({
  id: z.uuid(),
  testCaseId: z.string().min(3, 'Test Case ID is required').max(100),
  actualResult: z.string().min(10, 'Actual result is too short').optional(),
  executionStatus: z.enum(['passed', 'failed', 'pending']).optional(),
  executionDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive().default(1),
});
