import { registerAs } from '@nestjs/config';
import { Tour } from '../modules/tour/entities/tour.entity';
import { Schedule } from '../modules/schedule/entities/schedule.entity';
import { Price } from '../modules/price/entities/price.entity';
import { Admin } from '../modules/admin/entities/admin.entity';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'tours_db',
  entities: [Tour, Schedule, Price, Admin],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
}));
