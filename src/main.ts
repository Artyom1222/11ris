import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  try {
    // Создаем приложение
    const app = await NestFactory.create(AppModule);
    
    // Получаем логгер из провайдеров
    const logger = app.get(LoggerService);
    app.useLogger(logger);

    // Получаем конфигурацию
    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port') || 4000;

    // Глобальная валидация DTO
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Запускаем приложение
    await app.listen(port);
    logger.log(`Приложение запущено на порту ${port}`);
    
  } catch (error) {
    console.error('Ошибка при запуске приложения:', error);
    process.exit(1);
  }
}

bootstrap();
