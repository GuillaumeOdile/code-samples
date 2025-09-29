import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  UserNotFoundError,
  UserEmailAlreadyExistsError,
  InvalidUserDataError,
} from './domain-errors';

/**
 * Global exception filter for domain errors
 *
 * Maps domain-specific errors to appropriate HTTP responses.
 * Provides consistent error handling across the application.
 */
@Catch(UserNotFoundError, UserEmailAlreadyExistsError, InvalidUserDataError)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode: number;
    let code: string;
    let message: string;

    if (exception instanceof UserNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      code = 'USER_NOT_FOUND';
      message = exception.message;
    } else if (exception instanceof UserEmailAlreadyExistsError) {
      statusCode = HttpStatus.CONFLICT;
      code = 'USER_EMAIL_EXISTS';
      message = exception.message;
    } else if (exception instanceof InvalidUserDataError) {
      statusCode = HttpStatus.BAD_REQUEST;
      code = 'INVALID_USER_DATA';
      message = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_ERROR';
      message = 'An internal error occurred';
    }

    // Log the error for debugging
    this.logger.error(
      `Domain error: ${exception.constructor.name}`,
      exception.stack,
    );

    // Send error response
    response.status(statusCode).json({
      statusCode,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
