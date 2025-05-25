import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from '../modules/auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  check(): string {
    return this.healthService.check();
  }
}
