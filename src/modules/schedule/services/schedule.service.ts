import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { EntityNotFoundException } from '../../../common/exceptions/not-found.exception';
import { TourService } from '../../tour/services/tour.service';
import { PriceService } from '../../price/services/price.service';
import { ValidationException } from '../../../common/exceptions/validation.exception';
import { IScheduleDeletionResult } from '../../../interfaces/schedule.interface';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @Inject(forwardRef(() => TourService))
    private readonly tourService: TourService,
    @Inject(forwardRef(() => PriceService))
    private readonly priceService: PriceService,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find();
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    
    if (!schedule) {
      throw new EntityNotFoundException('Расписание');
    }
    
    return schedule;
  }

  async findByTourId(tourId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({ where: { tourId } });
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    // Проверка существования тура
    await this.tourService.findOne(createScheduleDto.tourId);
    
    if (new Date(createScheduleDto.startDate) > new Date(createScheduleDto.endDate)) {
      throw new ValidationException('Дата начала не может быть позже даты окончания');
    }
    
    const schedule = this.scheduleRepository.create({
      tourId: createScheduleDto.tourId,
      isActive: createScheduleDto.isActive !== undefined ? createScheduleDto.isActive : true,
      startDate: createScheduleDto.startDate,
      endDate: createScheduleDto.endDate,
    });
    
    return this.scheduleRepository.save(schedule);
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    
    if (updateScheduleDto.tourId) {
      // Проверка существования тура
      await this.tourService.findOne(updateScheduleDto.tourId);
      schedule.tourId = updateScheduleDto.tourId;
    }
    
    if (updateScheduleDto.startDate !== undefined) {
      schedule.startDate = updateScheduleDto.startDate;
    }
    
    if (updateScheduleDto.endDate !== undefined) {
      schedule.endDate = updateScheduleDto.endDate;
    }
    
    if (updateScheduleDto.isActive !== undefined) {
      schedule.isActive = updateScheduleDto.isActive;
    }
    
    if (new Date(schedule.startDate) > new Date(schedule.endDate)) {
      throw new ValidationException('Дата начала не может быть позже даты окончания');
    }
    
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    await this.priceService.removeByScheduleId(id);
    await this.scheduleRepository.remove(schedule);
  }

  async removeByTourId(tourId: string): Promise<IScheduleDeletionResult> {
    const schedules = await this.findByTourId(tourId);
    const deletedIds = schedules.map(schedule => schedule.id);
    
    for (const schedule of schedules) {
      await this.priceService.removeByScheduleId(schedule.id);
    }
    
    await this.scheduleRepository.remove(schedules);
    
    return {
      success: true,
      deletedIds,
    };
  }
}
