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
import { AgentService } from './agent.service';
import { Agent } from 'libs/entity/agent.entity';
import { CreateAgentDto, UpdateAgentDto } from 'libs/dto/agent.dto';
import { SearchDto } from 'libs/global/search.dto';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  async findAll(@Query() searchDto: SearchDto): Promise<{ size: number; data: Agent[] }> {
    return this.agentService.findAll(searchDto);
  }

  @Post()
  async create(@Body() createAgentDto: CreateAgentDto): Promise<Agent> {
    return this.agentService.create(createAgentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Agent> {
    return this.agentService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ): Promise<Agent> {
    return this.agentService.update(+id, updateAgentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.agentService.remove(+id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string): Promise<Agent> {
    return this.agentService.restore(+id);
  }
}
