import { IsNotEmpty, IsString } from 'class-validator';
import { IAdminLoginDTO } from '../../../interfaces/admin.interface';

export class LoginDto implements IAdminLoginDTO {
  @IsNotEmpty({ message: 'Логин обязателен' })
  @IsString({ message: 'Логин должен быть строкой' })
  login!: string;

  @IsNotEmpty({ message: 'Пароль обязателен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password!: string;
}
