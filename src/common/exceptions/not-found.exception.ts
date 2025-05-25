import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string) {
    super(`${entityName} не найден`);
  }
}
