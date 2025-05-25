import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PriceService } from '../services/price.service';
import { CreatePriceDto } from '../dto/create-price.dto';
import { UpdatePriceDto } from '../dto/update-price.dto';
import { Price } from '../entities/price.entity';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  async findAll(): Promise<Price[]> {
    return this.priceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Price> {
    return this.priceService.findOne(id);
  }

  @Post()
  async create(@Body() createPriceDto: CreatePriceDto): Promise<Price> {
    return this.priceService.create(createPriceDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ): Promise<Price> {
    return this.priceService.update(id, updatePriceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.priceService.remove(id);
  }
}
