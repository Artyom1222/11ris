import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from '../entities/tour.entity';
import { CreateTourDto } from '../dto/create-tour.dto';
import { UpdateTourDto } from '../dto/update-tour.dto';
import { EntityNotFoundException } from '../../../common/exceptions/not-found.exception';
import { DuplicateResourceException } from '../../../common/exceptions/duplicate-resource.exception';
import { ScheduleService } from '../../schedule/services/schedule.service';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @Inject(forwardRef(() => ScheduleService))
    private readonly scheduleService: ScheduleService,
  ) {}

  async findAll(): Promise<Tour[]> {
    return this.tourRepository.find();
  }

  async findOne(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    
    if (!tour) {
      throw new EntityNotFoundException('Тур');
    }
    
    return tour;
  }

  async findBySlug(slug: string): Promise<Tour | null> {
    return this.tourRepository.findOne({ where: { slug } });
  }

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const slug = Tour.createSlug(createTourDto.title);
    const existingTour = await this.findBySlug(slug);
    
    if (existingTour) {
      throw new DuplicateResourceException('Тур с таким названием уже существует');
    }
    
    const tour = this.tourRepository.create({
      title: createTourDto.title,
      slug,
      description: createTourDto.description || '',
      isActive: createTourDto.isActive !== undefined ? createTourDto.isActive : true,
    });
    
    return this.tourRepository.save(tour);
  }

  async update(id: string, updateTourDto: UpdateTourDto): Promise<Tour> {
    const tour = await this.findOne(id);
    
    if (updateTourDto.title) {
      tour.title = updateTourDto.title;
      tour.slug = Tour.createSlug(updateTourDto.title);
    }
    
    if (updateTourDto.description !== undefined) {
      tour.description = updateTourDto.description;
    }
    
    if (updateTourDto.isActive !== undefined) {
      tour.isActive = updateTourDto.isActive;
    }
    
    return this.tourRepository.save(tour);
  }

  async remove(id: string): Promise<void> {
    const tour = await this.findOne(id);
    await this.scheduleService.removeByTourId(id);
    await this.tourRepository.remove(tour);
  }
}
