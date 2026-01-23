import { z } from 'zod';
import { TestCaseStatusSchema } from '@ipinstaq/shared/types/types.ts';
/**
 * We define the "Source of Truth" for what a Test Case IS.
 */
export const TestCaseSchema = z.object({
  id: z.uuid("The provided ID is not a valid UUID format").optional(),
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  expectedResult: z.string(),
  status: TestCaseStatusSchema,
  version: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
});

// Instead of writing the interface manually, we infer it from the schema!
export type TestCase = z.infer<typeof TestCaseSchema>;
