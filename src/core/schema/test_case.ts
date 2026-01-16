import { z } from "zod";

/**
 * We define the "Source of Truth" for what a Test Case IS.
 */
export const TestCaseSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  expectedResult: z.string(),
  status: z.enum(["draft", "active", "archived"]),
  version: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
});

// Instead of writing the interface manually, we infer it from the schema!
export type TestCase = z.infer<typeof TestCaseSchema>;