/**
 * Security Configuration
 *
 * Security-related configuration including CORS, rate limiting, and headers.
 * Follows security best practices for production applications.
 */

import { registerAs } from '@nestjs/config';

export interface SecurityConfig {
  cors: {
    origin: string | string[];
    methods: string[];
    credentials: boolean;
    allowedHeaders: string[];
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  helmet: {
    contentSecurityPolicy: boolean;
    crossOriginEmbedderPolicy: boolean;
  };
}

export default registerAs('security', (): SecurityConfig => {
  const corsOrigin =
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173';
  const corsMethods = (
    process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH'
  ).split(',');
  const corsCredentials = process.env.CORS_CREDENTIALS === 'true';
  const corsAllowedHeaders = (
    process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization'
  ).split(',');

  const rateLimitWindowMs = parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || '900000',
    10,
  ); // 15 minutes
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
  const rateLimitMessage =
    process.env.RATE_LIMIT_MESSAGE ||
    'Too many requests from this IP, please try again later.';

  const helmetCSP = process.env.HELMET_CSP !== 'false';
  const helmetCOEP = process.env.HELMET_COEP !== 'false';

  return {
    cors: {
      origin: corsOrigin.includes(',') ? corsOrigin.split(',') : corsOrigin,
      methods: corsMethods,
      credentials: corsCredentials,
      allowedHeaders: corsAllowedHeaders,
    },
    rateLimit: {
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
      message: rateLimitMessage,
    },
    helmet: {
      contentSecurityPolicy: helmetCSP,
      crossOriginEmbedderPolicy: helmetCOEP,
    },
  };
});
