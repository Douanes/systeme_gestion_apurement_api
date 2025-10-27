import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
  import { MaisonTransitService } from './maison-transit.service';
import { MaisonTransit } from 'libs/entity/maison-transit.entity';
import { CreateMaisonTransitDto, UpdateMaisonTransitDto } from 'libs/dto/maison_transit.dto';
import { SearchDto } from 'libs/global/search.dto';
  
  @Controller('maison-transits')
  export class MaisonTransitController {
    constructor(private readonly maisonTransitService: MaisonTransitService) {}
    
    @Get()
    async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: MaisonTransit[] }> {
      return this.maisonTransitService.findAll(searchDto);
    }
    
    @Post()
    async create(@Body() createMaisonTransitDto: CreateMaisonTransitDto): Promise<MaisonTransit> {
      return this.maisonTransitService.create(createMaisonTransitDto);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<MaisonTransit> {
      return this.maisonTransitService.findOne(+id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateMaisonTransitDto: UpdateMaisonTransitDto,
    ): Promise<MaisonTransit> {
      return this.maisonTransitService.update(+id, updateMaisonTransitDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ success: boolean }> {
      return this.maisonTransitService.remove(+id);
    }
  
    @Post(':id/restore')
    async restore(@Param('id') id: string): Promise<MaisonTransit> {
      return this.maisonTransitService.restore(+id);
    }
  }