import { AppError, DatabaseError, InternalServerError, ValidationError } from '@ipinstaq/shared/errors.ts';
import z from 'zod';
//import { PostgresError } from 'postgres';

export async function errorMiddleware(_req: Request, next: () => Promise<Response>) {
  try {
    return await next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err);
      const validationError = new ValidationError(err);
      return Response.json({
        error: validationError.name,
        message: validationError.message,
        status: validationError.status,
        errors: validationError.details,
        timestamp: validationError.timeStamp,
      }, { status: validationError.status });
    }

    if (err instanceof AppError) {

      return Response.json({
        error: err.name,
        message: err.message,
        status: err.status,
        errors: err.details,
        timestamp: err.timeStamp,
      }, { status: err.status });

     } else if (err instanceof DatabaseError) {
    //   const dbError = err.details  ? new DatabaseError() : new InternalServerError("Database error occurred");
    //   return Response.json({
    //     error: dbError.name,
    //     message: dbError.message,
    //     status: dbError.status,
    //     timestamp: dbError.timeStamp,
    //   }, { status: dbError.status });
    }
    
      console.log(err);
      return Response.json({
        error: 'InternalServerError',
        message: 'An unexpected error occurred',
        status: 500,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    
  }
}
