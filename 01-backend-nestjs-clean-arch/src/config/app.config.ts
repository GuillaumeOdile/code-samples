/**
 * Application Configuration
 *
 * Centralized configuration management with environment variable validation.
 * Follows clean architecture by separating configuration concerns.
 */

import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  apiPrefix: string;
  swaggerPath: string;
}

export default registerAs('app', (): AppConfig => {
  const port = parseInt(process.env.PORT || '3000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';
  const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  const apiPrefix = process.env.API_PREFIX || 'api';
  const swaggerPath = process.env.SWAGGER_PATH || 'api';

  // Validation
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT: ${process.env.PORT}. Must be a number between 1-65535`,
    );
  }

  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error(
      `Invalid NODE_ENV: ${nodeEnv}. Must be development, production, or test`,
    );
  }

  return {
    port,
    nodeEnv,
    corsOrigin,
    apiPrefix,
    swaggerPath,
  };
});
