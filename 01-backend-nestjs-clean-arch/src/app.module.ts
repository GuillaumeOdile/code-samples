import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './health/health.module';
import {
  appConfig,
  databaseConfig,
  validationConfig,
  securityConfig,
} from './config';

// Main app module - keeping it simple with just the essentials
// Each feature gets its own module to keep things organized
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, validationConfig, securityConfig],
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    UsersModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
