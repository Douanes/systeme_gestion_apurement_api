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
import { OrdreMissionService } from './ordre-mission.service';
import { OrdreMission } from 'libs/entity/ordre-mission.entity';
import { CreateOrdreMissionDto, UpdateOrdreMissionDto } from 'libs/dto/ordre-mission.dto';
import { SearchDto } from 'libs/global/search.dto';

@Controller('ordres-mission')
export class OrdreMissionController {
  constructor(private readonly ordreMissionService: OrdreMissionService) {}

  @Get()
  async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: OrdreMission[] }> {
    return this.ordreMissionService.findAll(searchDto);
  }

  @Post()
  async create(@Body() createOrdreMissionDto: CreateOrdreMissionDto): Promise<OrdreMission> {
    return this.ordreMissionService.create(createOrdreMissionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrdreMission> {
    return this.ordreMissionService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrdreMissionDto: UpdateOrdreMissionDto,
  ): Promise<OrdreMission> {
    return this.ordreMissionService.update(+id, updateOrdreMissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.ordreMissionService.remove(+id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<OrdreMission> {
    return this.ordreMissionService.restore(+id);
  }
}
