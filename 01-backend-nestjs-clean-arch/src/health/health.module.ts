import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * Health module
 *
 * Provides health check functionality for monitoring and orchestration.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
