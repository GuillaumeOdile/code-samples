import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationFilter } from './common/errors/validation-exception.filter';
import {
  LoggingInterceptor,
  TransformResponseInterceptor,
} from './common/interceptors';
import { AppConfig, ValidationConfig, SecurityConfig } from './config';

// App bootstrap - setting up all the global stuff
// Swagger, validation, error handling, etc.
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Load configs
  const appConfig = configService.get<AppConfig>('app')!;
  const validationConfig = configService.get<ValidationConfig>('validation')!;
  const securityConfig = configService.get<SecurityConfig>('security')!;

  // Set up validation globally
  app.useGlobalPipes(new ValidationPipe(validationConfig.globalValidation));

  // Add interceptors for logging and response formatting
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  // Global error handling
  app.useGlobalFilters(new ValidationFilter());

  // CORS setup
  app.enableCors(securityConfig.cors);

  // Swagger setup for API docs
  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('Simple user management API')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(appConfig.swaggerPath, app, document);

  await app.listen(appConfig.port);

  console.log(
    `🚀 Application is running on: http://localhost:${appConfig.port}`,
  );
  console.log(
    `📚 API Documentation: http://localhost:${appConfig.port}/${appConfig.swaggerPath}`,
  );
  console.log(`🌍 Environment: ${appConfig.nodeEnv}`);
}

bootstrap();
