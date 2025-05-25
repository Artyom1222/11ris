import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip, body, query } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
        'RequestLogger'
      );

      this.logger.debug(
        JSON.stringify({
          method,
          url: originalUrl,
          statusCode,
          ip,
          responseTime,
          query,
          body,
        }),
        'RequestLogger'
      );
    });

    next();
  }
}
