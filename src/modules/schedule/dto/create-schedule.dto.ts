import { IsBoolean, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IScheduleDTO } from '../../../interfaces/schedule.interface';

export class CreateScheduleDto implements IScheduleDTO {
  @IsNotEmpty({ message: 'ID тура обязателен' })
  @IsUUID('all', { message: 'ID тура должен быть валидным UUID' })
  tourId!: string;

  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть логическим значением' })
  isActive?: boolean;

  @IsNotEmpty({ message: 'Дата начала обязательна' })
  @IsISO8601({}, { message: 'Дата начала должна быть в формате ISO 8601' })
  startDate!: string;

  @IsNotEmpty({ message: 'Дата окончания обязательна' })
  @IsISO8601({}, { message: 'Дата окончания должна быть в формате ISO 8601' })
  endDate!: string;
}
