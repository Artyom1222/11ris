import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { Schedule } from '../entities/schedule.entity';
import { PriceService } from '../../price/services/price.service';
import { Price } from '../../price/entities/price.entity';

@Controller('schedules')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly priceService: PriceService,
  ) {}

  @Get()
  async findAll(): Promise<Schedule[]> {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Schedule> {
    return this.scheduleService.findOne(id);
  }

  @Get(':id/prices')
  async findPrices(@Param('id') id: string): Promise<Price[]> {
    // Проверка существования расписания
    await this.scheduleService.findOne(id);
    return this.priceService.findByScheduleId(id);
  }

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleService.create(createScheduleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.scheduleService.remove(id);
  }
}
