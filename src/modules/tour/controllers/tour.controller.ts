import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TourService } from '../services/tour.service';
import { CreateTourDto } from '../dto/create-tour.dto';
import { UpdateTourDto } from '../dto/update-tour.dto';
import { Tour } from '../entities/tour.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { ScheduleService } from '../../schedule/services/schedule.service';

@Controller('tours')
export class TourController {
  constructor(
    private readonly tourService: TourService,
    private readonly scheduleService: ScheduleService,
  ) {}

  @Get()
  async findAll(): Promise<Tour[]> {
    return this.tourService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tour> {
    return this.tourService.findOne(id);
  }

  @Get(':id/schedules')
  async findSchedules(@Param('id') id: string): Promise<Schedule[]> {
    // Проверка существования тура
    await this.tourService.findOne(id);
    return this.scheduleService.findByTourId(id);
  }

  @Post()
  async create(@Body() createTourDto: CreateTourDto): Promise<Tour> {
    return this.tourService.create(createTourDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
  ): Promise<Tour> {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.tourService.remove(id);
  }
}
