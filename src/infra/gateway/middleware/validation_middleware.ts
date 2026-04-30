import z from 'zod';
import { ValidationError } from '@ipinstaq/shared/errors.ts';
import type { AppHandler, RouteHandler } from '../routers/routing_types.ts';

// Define the structure of the request to be validated - contract enforcement
export const RequestValidationSchema = z.object({
  body: z.any().optional(),
  params: z.record(z.string(), z.any()).optional(),
  query: z.record(z.string(), z.any()).optional(),
});

export interface AppRequest<T = unknown> {
  req: Request;
  params?: Record<string, string>;
  validated: T;
}

export type ValidatedRequest = z.infer<typeof RequestValidationSchema>;


function validate<T extends z.ZodType>( schema: T, select: (req: ValidatedRequest) => unknown) {
  
  return async function ( appreq: AppRequest<unknown>, next: () => Promise<Response>) {

    console.log("Validating request...", appreq.req.method, appreq.req.url);
    const url = new URL(appreq.req.url);

    //Normalize input for validation
    const input: ValidatedRequest = {
      body: appreq.req.headers.get("content-type")?.includes("application/json")
        ? await appreq.req.json() : undefined,

      params: appreq.params,
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
    console.log("Validated Request:", selected);
    const result = schema.safeParse(selected);
    console.log("Validation result:", result);
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    appreq.validated = result.data;
    return await next();
  };
}

export function withValidation<T>(
  schema: z.ZodType<T>, 
  select: (req: ValidatedRequest) => unknown, 
  handler: AppHandler<T>): RouteHandler {

  return async ({deps, req}): Promise<Response> => {
    return await validate(schema, select)(req, async () => {
      const validatedReq = req as AppRequest<T>
      return await handler(validatedReq, deps);
    });
  }
}

export function withoutValidation<T>(handler: AppHandler<unknown>): RouteHandler {
  return ({deps, req}): Promise<Response> => {
    return handler(req, deps)
  }
}
