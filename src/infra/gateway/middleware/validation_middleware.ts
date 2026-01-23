import z from 'zod';
import { ValidationError } from '@ipinstaq/shared/errors.ts';

// Define the structure of the request to be validated - contract enforcement
export const RequestValidationSchema = z.object({
  body: z.any().optional(),
  params: z.record(z.string(), z.any()).optional(),
  query: z.record(z.string(), z.any()).optional(),
});

export type ValidatedRequest = z.infer<typeof RequestValidationSchema>;


export function validate<T extends z.ZodType>(schema: T) {
  
  return async function (
    req: Request & { params?: Record<string, string> },
    next: (data: z.infer<T>) => Promise<Response>
  ) {
    const url = new URL(req.url);

    const input: ValidatedRequest = {
      body: req.headers.get("content-type")?.includes("application/json")
        ? await req.json() : undefined,

      params: req.params,
      query: Object.fromEntries(url.searchParams),
    };

    // 🔒 CONTRACT ENFORCEMENT
    const contractResult = RequestValidationSchema.safeParse(input);
    if (!contractResult.success) {
      // This should NEVER happen unless middleware is broken
      throw new Error("Invalid validation contract");
    }

    // 🎯 ACTUAL VALIDATION
    const result = schema.safeParse(contractResult.data);
    console.log("Validation result:", result);
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    return await next(result.data);
  };
}
