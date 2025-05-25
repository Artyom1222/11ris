import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IAdminDTO } from '../../../interfaces/admin.interface';

export class CreateAdminDto implements IAdminDTO {
  @IsNotEmpty({ message: 'Логин обязателен' })
  @IsString({ message: 'Логин должен быть строкой' })
  login!: string;

  @IsNotEmpty({ message: 'Пароль обязателен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password!: string;

  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть логическим значением' })
  isActive?: boolean;
}
