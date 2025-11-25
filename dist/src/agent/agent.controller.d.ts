import { AgentService } from './agent.service';
import { CreateAgentDto, UpdateAgentDto, AgentResponseDto, AgentWithRelationsDto } from 'libs/dto/agent/agent.dto';
import { AgentPaginationQueryDto } from 'libs/dto/agent/pagination.dto';
import { PaginatedResponseDto, SuccessResponseDto } from 'libs/dto/global/response.dto';
export declare class AgentController {
    private readonly agentService;
    constructor(agentService: AgentService);
    create(createAgentDto: CreateAgentDto): Promise<AgentResponseDto>;
    findAll(paginationQuery: AgentPaginationQueryDto): Promise<PaginatedResponseDto<AgentResponseDto>>;
    findOne(id: number): Promise<AgentResponseDto | AgentWithRelationsDto>;
    getStatistics(id: number): Promise<{
        agentId: number;
        totalDeclarations: number;
        totalEscouadesAsChef: number;
        totalEscouadesAsAdjoint: number;
        totalEscouadesMember: number;
        totalOrdreMissions: number;
    }>;
    update(id: number, updateAgentDto: UpdateAgentDto): Promise<AgentResponseDto>;
    activate(id: number): Promise<SuccessResponseDto<AgentResponseDto>>;
    deactivate(id: number): Promise<SuccessResponseDto<AgentResponseDto>>;
    remove(id: number): Promise<void>;
}
