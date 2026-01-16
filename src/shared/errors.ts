import type {PostgresError} from 'postgres';
import type z from 'zod';

type ZodErrorDetails = z.ZodFlattenedError<z.ZodError>;

class AppError <Type=unknown> extends Error {
  status: number;
  timeStamp: string;
  details?: Type
  
  constructor(message: string, status: number, details?:Type) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.timeStamp = new Date().toISOString();
    this.details = details;
  }
}

class ValidationError extends AppError<ZodErrorDetails> {
  constructor(details: ZodErrorDetails) {
    const message = details.formErrors.length ? details.formErrors.join(", ") : "Invalid input data";
    super(message, 400, details);

  }
}

class DatabaseError extends AppError<PostgresError> {
  constructor(detail: PostgresError) {
    const field = DatabaseError.extractFieldFromPostgresError(detail.data);
    // If the error is related to a unique constraint violation, we can extract the field name
    // from the detail message.
    const message = field
      ? `${field} already exists`
      : "Value already exists";
    super(message, 409, detail);
  }

  static extractFieldFromPostgresError(detailMsg?: string): string | null {
    // Postgres error messages often contain the field name in the format "(field_name)=value"
    if (!detailMsg) return null;
    const match = detailMsg.match(/\((.*?)\)=/);
    return match?.[1] ?? null;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource") {
    super(`${message} not found`, 404);
  }
}

class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export { 
  AppError, 
  ValidationError, 
  UnauthorizedError, 
  ForbiddenError, 
  NotFoundError, 
  InternalServerError, 
  DatabaseError
};