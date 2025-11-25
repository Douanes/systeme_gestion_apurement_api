import { PrismaService } from 'prisma/prisma.service';
import { CreateAgentDto, UpdateAgentDto, AgentResponseDto, AgentWithRelationsDto } from 'libs/dto/agent/agent.dto';
import { AgentPaginationQueryDto } from 'libs/dto/agent/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
export declare class AgentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toResponseDto;
    create(createAgentDto: CreateAgentDto): Promise<AgentResponseDto>;
    findAll(paginationQuery: AgentPaginationQueryDto): Promise<PaginatedResponseDto<AgentResponseDto>>;
    findOne(id: number): Promise<AgentResponseDto | AgentWithRelationsDto>;
    update(id: number, updateAgentDto: UpdateAgentDto): Promise<AgentResponseDto>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<AgentResponseDto>;
    deactivate(id: number): Promise<AgentResponseDto>;
    getStatistics(id: number): Promise<{
        agentId: number;
        totalDeclarations: number;
        totalEscouadesAsChef: number;
        totalEscouadesAsAdjoint: number;
        totalEscouadesMember: number;
        totalOrdreMissions: number;
    }>;
}
