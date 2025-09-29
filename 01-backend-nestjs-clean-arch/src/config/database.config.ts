/**
 * Database Configuration
 *
 * Database connection configuration with environment variable validation.
 * Supports both in-memory and persistent storage options.
 */

import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  type: 'memory' | 'postgres' | 'mysql';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  synchronize: boolean;
  logging: boolean;
}

export default registerAs('database', (): DatabaseConfig => {
  const type = (process.env.DB_TYPE || 'memory') as
    | 'memory'
    | 'postgres'
    | 'mysql';
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT
    ? parseInt(process.env.DB_PORT, 10)
    : undefined;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const synchronize = process.env.DB_SYNCHRONIZE === 'true';
  const logging = process.env.DB_LOGGING === 'true';

  // Validation for persistent databases
  if (type !== 'memory') {
    if (!host) {
      throw new Error(`DB_HOST is required when DB_TYPE is ${type}`);
    }
    if (!port || isNaN(port) || port < 1 || port > 65535) {
      throw new Error(
        `Invalid DB_PORT: ${process.env.DB_PORT}. Must be a number between 1-65535`,
      );
    }
    if (!username) {
      throw new Error(`DB_USERNAME is required when DB_TYPE is ${type}`);
    }
    if (!database) {
      throw new Error(`DB_NAME is required when DB_TYPE is ${type}`);
    }
  }

  return {
    type,
    host,
    port,
    username,
    password,
    database,
    synchronize,
    logging,
  };
});
