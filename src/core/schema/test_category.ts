import z from 'zod';

export const TestCategorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required").max(255),
});

