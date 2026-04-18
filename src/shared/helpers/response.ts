interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export function sendSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    message,
    data,
  };
}