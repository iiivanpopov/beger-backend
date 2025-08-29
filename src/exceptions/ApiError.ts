import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class ApiError extends Error {
  status: ContentfulStatusCode
  details?: unknown

  constructor(
    message: string = 'Unexpected error',
    status: ContentfulStatusCode = 500,
    details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  static BadRequest(message = 'Bad Request', details?: unknown) {
    return new ApiError(message, 400, details)
  }

  static Unauthorized(message = 'Unauthorized', details?: unknown) {
    return new ApiError(message, 401, details)
  }

  static Forbidden(message = 'Forbidden', details?: unknown) {
    return new ApiError(message, 403, details)
  }

  static NotFound(message = 'Not Found', details?: unknown) {
    return new ApiError(message, 404, details)
  }

  static InternalError(message = 'Internal Server Error', details?: unknown) {
    return new ApiError(message, 500, details)
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      details: this.details
    }
  }
}
