import { IsBoolean, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @IsOptional()
  @IsUUID('all', { message: 'ID тура должен быть валидным UUID' })
  tourId?: string;

  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть логическим значением' })
  isActive?: boolean;

  @IsOptional()
  @IsISO8601({}, { message: 'Дата начала должна быть в формате ISO 8601' })
  startDate?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Дата окончания должна быть в формате ISO 8601' })
  endDate?: string;
}
