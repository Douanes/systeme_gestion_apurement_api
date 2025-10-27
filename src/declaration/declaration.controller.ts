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
import { DeclarationService } from './declaration.service';
import { Declaration } from 'libs/entity/declaration.entity';
import { CreateDeclarationDto, UpdateDeclarationDto } from 'libs/dto/declaration.dto';
import { SearchDto } from 'libs/global/search.dto';

@Controller('declarations')
export class DeclarationController {
  constructor(private readonly declarationService: DeclarationService) {}
  
  @Get()
  async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: Declaration[] }> {
    return this.declarationService.findAll(searchDto);
  }

  @Post()
  async create(@Body() createDeclarationDto: CreateDeclarationDto): Promise<Declaration> {
    return this.declarationService.create(createDeclarationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Declaration> {
    return this.declarationService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeclarationDto: UpdateDeclarationDto,
  ): Promise<Declaration> {
    return this.declarationService.update(+id, updateDeclarationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.declarationService.remove(+id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<Declaration> {
    return this.declarationService.restore(+id);
  }
}