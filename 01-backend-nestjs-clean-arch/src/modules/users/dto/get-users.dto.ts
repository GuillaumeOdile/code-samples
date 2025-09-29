import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Combined DTO for GET /users endpoint
 * Includes both pagination and filtering parameters
 *
 * Note: Validation is handled at the service level for flexibility
 */
export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page (max 100)',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by email (partial match)',
    example: 'john@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by first name (partial match)',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Filter by last name (partial match)',
    example: 'Doe',
  })
  lastName?: string;
}
