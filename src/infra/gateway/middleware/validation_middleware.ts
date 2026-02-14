import z from 'zod';
import { ValidationError } from '@ipinstaq/shared/errors.ts';
import type { AppHandler, RouteHandler } from '../routers/routing_types.ts';

// Define the structure of the request to be validated - contract enforcement
export const RequestValidationSchema = z.object({
  body: z.any().optional(),
  params: z.record(z.string(), z.any()).optional(),
  query: z.record(z.string(), z.any()).optional(),
});

export type AppRequest = Request & {
  params?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
  validated?: unknown;
}

export type ValidatedRequest = z.infer<typeof RequestValidationSchema>;


function validate<T extends z.ZodType>(
  schema: T, 
  select: (req: ValidatedRequest) => unknown
) {
  
  return async function (
    req: AppRequest,
    next: () => Promise<Response>
  ) {
    const url = new URL(req.url);

    //Normalize input for validation
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
    const selected = select(contractResult.data);
    const result = schema.safeParse(selected);
    console.log("Validation result:", result);
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    req.validated = result.data;
    return await next();
  };
}

export function withValidation<T>(
  schema: z.ZodType<T>, 
  select: (req: ValidatedRequest) => unknown, 
  handler: AppHandler): RouteHandler {

  return async ({deps, req}): Promise<Response> => {
    return await validate(schema, select)(req, async () => {
      return await handler(req, deps);
    });
  }
}

export function withoutValidation(handler: AppHandler): RouteHandler {
  return ({deps, req}): Promise<Response> => {
    return handler(req, deps);
  }
}
