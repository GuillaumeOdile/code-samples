import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object for updating a user
 *
 * Extends CreateUserDto but makes all fields optional.
 * This ensures consistent validation rules while allowing partial updates.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
