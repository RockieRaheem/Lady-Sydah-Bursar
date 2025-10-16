export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiErrorResponse {
  error: string;
  statusCode: number;
  details?: any;
}

export async function handleApiError(
  error: unknown
): Promise<ApiErrorResponse> {
  if (error instanceof ApiError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500,
    };
  }

  return {
    error: "An unexpected error occurred",
    statusCode: 500,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function createApiError(
  statusCode: number,
  message: string,
  details?: any
): ApiError {
  return new ApiError(statusCode, message, details);
}

// Common API errors
export const API_ERRORS = {
  UNAUTHORIZED: (message = "Unauthorized") => createApiError(401, message),
  FORBIDDEN: (message = "Forbidden") => createApiError(403, message),
  NOT_FOUND: (message = "Resource not found") => createApiError(404, message),
  BAD_REQUEST: (message = "Bad request", details?: any) =>
    createApiError(400, message, details),
  INTERNAL_ERROR: (message = "Internal server error") =>
    createApiError(500, message),
  VALIDATION_ERROR: (details: any) =>
    createApiError(400, "Validation failed", details),
};
