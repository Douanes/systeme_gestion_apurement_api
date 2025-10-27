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
import { RegimeService } from './regime.service';
import { CreateRegimeDto, UpdateRegimeDto } from 'libs/dto/regime.dto';
import { SearchDto } from 'libs/global/search.dto';
import { Regime } from 'libs/entity/regime.entity';
  
  @Controller('regimes')
  export class RegimeController {
    constructor(private readonly regimeService: RegimeService) {}
    
    @Get()
    async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: Regime[] }> {
      return this.regimeService.findAll(searchDto);
    }
    
    @Post()
    async create(@Body() createRegimeDto: CreateRegimeDto): Promise<Regime> {
      return this.regimeService.create(createRegimeDto);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Regime> {
      return this.regimeService.findOne(+id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateRegimeDto: UpdateRegimeDto,
    ): Promise<Regime> {
      return this.regimeService.update(+id, updateRegimeDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ success: boolean }> {
      return this.regimeService.remove(+id);
    }
  
    @Post(':id/restore')
    async restore(@Param('id') id: string): Promise<Regime> {
      return this.regimeService.restore(+id);
    }
  }