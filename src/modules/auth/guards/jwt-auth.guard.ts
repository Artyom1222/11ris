import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../../admin/services/admin.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ITokenPayload } from '../../../interfaces/admin.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Проверяем, помечен ли эндпоинт как публичный
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Токен авторизации отсутствует');
    }

    try {
      const payload = this.jwtService.verify<ITokenPayload>(token, {
        secret: this.configService.get<string>('app.jwtSecret'),
      });

      const admin = await this.adminService.findOne(payload.id);
      
      if (!admin) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      if (!admin.isActive) {
        throw new UnauthorizedException('Пользователь не активен');
      }

      // Добавляем данные пользователя в запрос для использования в контроллерах
      request['user'] = payload;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Недействительный или просроченный токен');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    
    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
