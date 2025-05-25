import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceDto } from './create-price.dto';

export class UpdatePriceDto extends PartialType(CreatePriceDto) {
  @IsOptional()
  @IsUUID('all', { message: 'ID расписания должен быть валидным UUID' })
  scheduleId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Значение цены должно быть числом' })
  priceValue?: number;

  @IsOptional()
  @IsString({ message: 'Валюта цены должна быть строкой' })
  priceCurrency?: string;
}
