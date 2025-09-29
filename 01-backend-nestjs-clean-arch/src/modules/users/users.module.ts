import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InMemoryUsersRepository } from './repositories/in-memory-users.repository';
import { UsersRepository } from './repositories/users.repository';

/**
 * Users module
 *
 * Demonstrates clean architecture with clear separation of concerns:
 * - Controller: HTTP request/response handling
 * - Service: Business logic and orchestration
 * - Repository: Data persistence abstraction
 *
 * Uses dependency injection to make the repository interchangeable.
 */
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: InMemoryUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
