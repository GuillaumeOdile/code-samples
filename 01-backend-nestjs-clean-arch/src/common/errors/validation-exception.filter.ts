import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Validation exception filter
 *
 * Provides detailed validation error messages for better developer experience.
 * Transforms class-validator errors into user-friendly responses.
 */
@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const exceptionResponse = exception.getResponse();

    // Extract validation errors from class-validator
    let validationErrors: string[] = [];
    let message = 'Validation failed';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;

      if (Array.isArray(responseObj.message)) {
        // Multiple validation errors
        validationErrors = responseObj.message;
        message = `Validation failed: ${validationErrors.join(', ')}`;
      } else if (typeof responseObj.message === 'string') {
        // Single validation error
        validationErrors = [responseObj.message];
        message = responseObj.message;
      }
    }

    // Log validation errors for debugging
    this.logger.warn(`Validation failed for ${request.method} ${request.url}`, {
      errors: validationErrors,
      body: request.body,
    });

    // Send detailed validation error response
    response.status(400).json({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message,
      errors: validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
