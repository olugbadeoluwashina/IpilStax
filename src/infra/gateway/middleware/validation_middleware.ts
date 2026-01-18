import z from 'zod';
import { ValidationError } from '@ipinstaq/shared/errors.ts';

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return async function (req: Request, next: (data: z.infer<T>) => Promise<Response>) {
    // Placeholder for future validation logic
    const result = schema.safeParse(await req.json());

    if (!result.success) {
      console.log(result.error);
      throw new ValidationError(z.flattenError(result.error));
    }

    return await next(result.data!);
  };
}
