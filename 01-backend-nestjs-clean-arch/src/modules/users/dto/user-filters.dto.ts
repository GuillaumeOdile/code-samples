import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for user filtering parameters
 */
export class UserFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by email (partial match)',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by first name (partial match)',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Filter by last name (partial match)',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
