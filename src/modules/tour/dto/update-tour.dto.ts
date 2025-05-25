import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDto } from './create-tour.dto';

export class UpdateTourDto extends PartialType(CreateTourDto) {
  @IsOptional()
  @IsString({ message: 'Название тура должно быть строкой' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Описание тура должно быть строкой' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть логическим значением' })
  isActive?: boolean;
}
