import { AppError } from '@ipinstaq/shared/errors.ts';
//import { PostgresError } from 'postgres';

export async function errorMiddleware(_req: Request, next: () => Promise<Response>) {
  try {
    return await next();
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json({
        error: err.name,
        message: err.message,
        status: err.status,
        errors: err.details?.fieldErrors,
        timestamp: err.timeStamp,
      }, { status: err.status });
    } // } else if (err instanceof PostgresError){
    //   const dbError = err.fields?.detail  ? new DatabaseError(err) : new InternalServerError("Database error occurred");
    //   return Response.json({
    //     error: dbError.name,
    //     message: dbError.message,
    //     status: dbError.status,
    //     timestamp: dbError.timeStamp,
    //   }, { status: dbError.status });
    // }
    else {
      console.log(err);
      return Response.json({
        error: 'InternalServerError',
        message: 'An unexpected error occurred',
        status: 500,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  }
}
