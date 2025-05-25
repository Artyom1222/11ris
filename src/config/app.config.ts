import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET_KEY || 'secret-key',
  environment: process.env.NODE_ENV || 'development',
  useFastify: process.env.USE_FASTIFY === 'true',
}));
