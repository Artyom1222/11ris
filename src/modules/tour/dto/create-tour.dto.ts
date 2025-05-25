import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ITourDTO } from '../../../interfaces/tour.interface';

export class CreateTourDto implements ITourDTO {
  @IsNotEmpty({ message: 'Название тура обязательно' })
  @IsString({ message: 'Название тура должно быть строкой' })
  title!: string;

  @IsOptional()
  @IsString({ message: 'Описание тура должно быть строкой' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть логическим значением' })
  isActive?: boolean;
}
