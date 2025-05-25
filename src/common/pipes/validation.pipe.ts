import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

export const createValidationPipe = (): ValidationPipe => {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const messages = validationErrors.map((error) => {
        return Object.values(error.constraints || {}).join(', ');
      });
      return new ValidationException(messages.join('; '));
    },
  });
};
