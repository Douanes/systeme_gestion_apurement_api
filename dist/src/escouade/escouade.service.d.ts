import { PrismaService } from 'prisma/prisma.service';
import { CreateEscouadeDto, UpdateEscouadeDto, EscouadeResponseDto, EscouadeWithRelationsDto } from 'libs/dto/escouade/escouade.dto';
import { EscouadePaginationQueryDto } from 'libs/dto/escouade/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
export declare class EscouadeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toResponseDto;
    create(createEscouadeDto: CreateEscouadeDto): Promise<EscouadeResponseDto>;
    findAll(paginationQuery: EscouadePaginationQueryDto): Promise<PaginatedResponseDto<EscouadeResponseDto>>;
    findOne(id: number): Promise<EscouadeResponseDto | EscouadeWithRelationsDto>;
    update(id: number, updateEscouadeDto: UpdateEscouadeDto): Promise<EscouadeResponseDto>;
    remove(id: number): Promise<void>;
    addAgent(escouadeId: number, agentId: number): Promise<void>;
    removeAgent(escouadeId: number, agentId: number): Promise<void>;
    getStatistics(id: number): Promise<{
        escouadeId: number;
        totalAgents: number;
    }>;
    assignChef(escouadeId: number, chefId: number): Promise<EscouadeResponseDto>;
    assignAdjoint(escouadeId: number, adjointId: number): Promise<EscouadeResponseDto>;
}
