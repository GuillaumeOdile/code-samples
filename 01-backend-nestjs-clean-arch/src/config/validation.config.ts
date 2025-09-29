/**
 * Validation Configuration
 *
 * Centralized validation settings for DTOs and pipes.
 * Ensures consistent validation behavior across the application.
 */

import { registerAs } from '@nestjs/config';
import { ValidationPipeOptions } from '@nestjs/common';

export interface ValidationConfig {
  globalValidation: ValidationPipeOptions;
  enableDetailedErrors: boolean;
  maxValidationErrors: number;
}

export default registerAs('validation', (): ValidationConfig => {
  const enableDetailedErrors =
    process.env.VALIDATION_DETAILED_ERRORS === 'true';
  const maxValidationErrors = parseInt(
    process.env.VALIDATION_MAX_ERRORS || '10',
    10,
  );

  const globalValidation: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: false,
  };

  return {
    globalValidation,
    enableDetailedErrors,
    maxValidationErrors,
  };
});
