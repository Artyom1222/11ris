import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ISchedule } from '../../../interfaces/schedule.interface';
import { Tour } from '../../tour/entities/tour.entity';
import { Price } from '../../price/entities/price.entity';

@Entity('schedules')
export class Schedule implements ISchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tourId!: string;

  @ManyToOne(() => Tour, (tour) => tour.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour!: Tour;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar' })
  startDate!: string;

  @Column({ type: 'varchar' })
  endDate!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => Price, (price) => price.schedule)
  prices!: Price[];
}
