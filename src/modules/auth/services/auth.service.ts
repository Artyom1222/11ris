import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../../admin/services/admin.service';
import { ILoginResponse, ITokenPayload } from '../../../interfaces/admin.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const admin = await this.adminService.findByLogin(loginDto.login);
    
    if (!admin) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    
    if (!admin.isActive) {
      throw new UnauthorizedException('Учетная запись неактивна');
    }
    
    const isPasswordValid = await this.adminService.validatePassword(
      loginDto.password,
      admin.password,
    );
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    
    const payload: ITokenPayload = {
      id: admin.id,
      login: admin.login,
    };
    
    const token = this.jwtService.sign(payload);
    
    return { token };
  }
}
