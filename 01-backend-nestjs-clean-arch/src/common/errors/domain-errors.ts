/**
 * Domain-specific error classes
 *
 * These errors represent business rule violations and are independent
 * of any external frameworks. They can be mapped to appropriate HTTP
 * status codes in the presentation layer.
 */

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor(userId: string) {
    super(`User with ID '${userId}' not found`, { userId });
  }
}

export class UserEmailAlreadyExistsError extends DomainError {
  readonly code = 'USER_EMAIL_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor(email: string) {
    super(`User with email '${email}' already exists`, { email });
  }
}

export class InvalidUserDataError extends DomainError {
  readonly code = 'INVALID_USER_DATA';
  readonly statusCode = 400;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
  }
}
