import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IPrice } from '../../../interfaces/price.interface';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity('prices')
export class Price implements IPrice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  scheduleId!: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule!: Schedule;

  @Column('numeric', { precision: 10, scale: 2 })
  priceValue!: number;

  @Column({ type: 'varchar' })
  priceCurrency!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
