/**
 * Parse Int Pipe
 *
 * Custom pipe for parsing and validating integer parameters.
 * Provides better error messages than the built-in ParseIntPipe.
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const { type, data } = metadata;

    // Only transform query and param values
    if (type !== 'query' && type !== 'param') {
      return value as any;
    }

    if (!value) {
      throw new BadRequestException(
        `Parameter '${data}' is required and must be a valid integer`,
      );
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        `Parameter '${data}' must be a valid integer, received: '${value}'`,
      );
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        `Parameter '${data}' must be a positive integer, received: ${parsedValue}`,
      );
    }

    return parsedValue;
  }
}
