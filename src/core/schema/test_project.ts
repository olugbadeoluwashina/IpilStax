import z from 'zod';

export const TestProjectInputSchema = z.object({
  name: z.string().min(3, "Project name is required").max(255),
  description: z.string().min(1, "Project description is required").max(255).nullable().optional(),
})

export const TestProjectSchema = TestProjectInputSchema.extend({
  id: z.uuid().optional(),
  projectCode: z.string().min(1, "Project code is required").max(10),
  createdAt: z.date(),
  updatedAt: z.date(),
});