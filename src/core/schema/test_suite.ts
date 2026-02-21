import z from 'zod';

export const TestSuiteSchema = z.object({
  id: z.string().min(1, "Suite ID is required").max(100),
  name: z.string().min(1, "Suite name is required").max(255),
  description: z.string().min(1, "Suite description is required").max(255).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});