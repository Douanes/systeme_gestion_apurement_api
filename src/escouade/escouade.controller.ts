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
import { EscouadeService } from './escouade.service';
import { Escouade } from 'libs/entity/escouade.entity';
import { CreateEscouadeDto, UpdateEscouadeDto } from 'libs/dto/escouade.dto';
import { SearchDto } from 'libs/global/search.dto';

@Controller('escouades')
export class EscouadeController {
  constructor(private readonly escouadeService: EscouadeService) {}

  @Get()
  async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: Escouade[] }> {
    return this.escouadeService.findAll(searchDto);
  }

  @Post()
  async create(@Body() createEscouadeDto: CreateEscouadeDto): Promise<Escouade> {
    return this.escouadeService.create(createEscouadeDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Escouade> {
    return this.escouadeService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEscouadeDto: UpdateEscouadeDto,
  ): Promise<Escouade> {
    return this.escouadeService.update(+id, updateEscouadeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.escouadeService.remove(+id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<Escouade> {
    return this.escouadeService.restore(+id);
  }
}
