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
import { BureauSortieService } from './bureau-sortie.service';
import { BureauSortie } from 'libs/entity/bureau-sortie.entity';
import { CreateBureauSortieDto, UpdateBureauSortieDto } from 'libs/dto/bureau-sortie.dto';
import { SearchDto } from 'libs/global/search.dto';

@Controller('bureaux-sortie')
export class BureauSortieController {
  constructor(private readonly bureauSortieService: BureauSortieService) {}

  @Get()
  async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: BureauSortie[] }> {
    return this.bureauSortieService.findAll(searchDto);
  }

  @Post()
  async create(@Body() createBureauSortieDto: CreateBureauSortieDto): Promise<BureauSortie> {
    return this.bureauSortieService.create(createBureauSortieDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BureauSortie> {
    return this.bureauSortieService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBureauSortieDto: UpdateBureauSortieDto,
  ): Promise<BureauSortie> {
    return this.bureauSortieService.update(+id, updateBureauSortieDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.bureauSortieService.remove(+id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<BureauSortie> {
    return this.bureauSortieService.restore(+id);
  }
}
