/**
 * Types that are used by the MVC layer for sending data back to the Nuxt application
 */

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type BadRequestError = ApiError & {
  code: 'BAD_REQUEST';
  statusCode: 400;
};

export type UnauthorizedError = ApiError & {
  code: 'UNAUTHORIZED';
  statusCode: 401;
};

export type ForbiddenError = ApiError & {
  code: 'FORBIDDEN';
  statusCode: 403;
};

export type NotFoundError = ApiError & {
  code: 'NOT_FOUND';
  statusCode: 404;
};

export type ConflictError = ApiError & {
  code: 'CONFLICT';
  statusCode: 409;
};

export type ValidationError = ApiError & {
  code: 'VALIDATION_ERROR';
  statusCode: 422;
  details: Record<string, string[]>;
};

export type InternalServerError = ApiError & {
  code: 'INTERNAL_SERVER_ERROR';
  statusCode: 500;
};

// Success Response Types
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  error: ApiError;
}

// List Response with Pagination
export interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Common Request Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery {
  search?: string;
}

export interface FilterQuery extends PaginationQuery, SortQuery, SearchQuery {}
