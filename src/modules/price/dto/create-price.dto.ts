import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { IPriceDTO } from '../../../interfaces/price.interface';

export class CreatePriceDto implements IPriceDTO {
  @IsNotEmpty({ message: 'ID расписания обязателен' })
  @IsUUID('all', { message: 'ID расписания должен быть валидным UUID' })
  scheduleId!: string;

  @IsNotEmpty({ message: 'Значение цены обязательно' })
  @IsNumber({}, { message: 'Значение цены должно быть числом' })
  priceValue!: number;

  @IsNotEmpty({ message: 'Валюта цены обязательна' })
  @IsString({ message: 'Валюта цены должна быть строкой' })
  priceCurrency!: string;
}
