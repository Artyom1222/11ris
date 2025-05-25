import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from '../entities/price.entity';
import { CreatePriceDto } from '../dto/create-price.dto';
import { UpdatePriceDto } from '../dto/update-price.dto';
import { EntityNotFoundException } from '../../../common/exceptions/not-found.exception';
import { ScheduleService } from '../../schedule/services/schedule.service';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    @Inject(forwardRef(() => ScheduleService))
    private readonly scheduleService: ScheduleService,
  ) {}

  async findAll(): Promise<Price[]> {
    return this.priceRepository.find();
  }

  async findOne(id: string): Promise<Price> {
    const price = await this.priceRepository.findOne({ where: { id } });
    
    if (!price) {
      throw new EntityNotFoundException('Цена');
    }
    
    return price;
  }

  async findByScheduleId(scheduleId: string): Promise<Price[]> {
    return this.priceRepository.find({ where: { scheduleId } });
  }

  async create(createPriceDto: CreatePriceDto): Promise<Price> {
    // Проверка существования расписания
    await this.scheduleService.findOne(createPriceDto.scheduleId);
    
    const price = this.priceRepository.create({
      scheduleId: createPriceDto.scheduleId,
      priceValue: createPriceDto.priceValue,
      priceCurrency: createPriceDto.priceCurrency,
    });
    
    return this.priceRepository.save(price);
  }

  async update(id: string, updatePriceDto: UpdatePriceDto): Promise<Price> {
    const price = await this.findOne(id);
    
    if (updatePriceDto.scheduleId) {
      // Проверка существования расписания
      await this.scheduleService.findOne(updatePriceDto.scheduleId);
      price.scheduleId = updatePriceDto.scheduleId;
    }
    
    if (updatePriceDto.priceValue !== undefined) {
      price.priceValue = updatePriceDto.priceValue;
    }
    
    if (updatePriceDto.priceCurrency !== undefined) {
      price.priceCurrency = updatePriceDto.priceCurrency;
    }
    
    return this.priceRepository.save(price);
  }

  async remove(id: string): Promise<void> {
    const price = await this.findOne(id);
    await this.priceRepository.remove(price);
  }

  async removeByScheduleId(scheduleId: string): Promise<void> {
    const prices = await this.findByScheduleId(scheduleId);
    if (prices.length > 0) {
      await this.priceRepository.remove(prices);
    }
  }
}
