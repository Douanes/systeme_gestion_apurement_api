import { EscouadeService } from './escouade.service';
import { CreateEscouadeDto, UpdateEscouadeDto, EscouadeResponseDto, EscouadeWithRelationsDto, AddAgentToEscouadeDto } from 'libs/dto/escouade/escouade.dto';
import { EscouadePaginationQueryDto } from 'libs/dto/escouade/pagination.dto';
import { PaginatedResponseDto, SuccessResponseDto } from 'libs/dto/global/response.dto';
export declare class EscouadeController {
    private readonly escouadeService;
    constructor(escouadeService: EscouadeService);
    create(createEscouadeDto: CreateEscouadeDto): Promise<EscouadeResponseDto>;
    findAll(paginationQuery: EscouadePaginationQueryDto): Promise<PaginatedResponseDto<EscouadeResponseDto>>;
    findOne(id: number): Promise<EscouadeResponseDto | EscouadeWithRelationsDto>;
    getStatistics(id: number): Promise<{
        escouadeId: number;
        totalAgents: number;
    }>;
    update(id: number, updateEscouadeDto: UpdateEscouadeDto): Promise<EscouadeResponseDto>;
    addAgent(id: number, addAgentDto: AddAgentToEscouadeDto): Promise<SuccessResponseDto<null>>;
    removeAgent(id: number, agentId: number): Promise<SuccessResponseDto<null>>;
    assignChef(id: number, chefId: number): Promise<SuccessResponseDto<EscouadeResponseDto>>;
    assignAdjoint(id: number, adjointId: number): Promise<SuccessResponseDto<EscouadeResponseDto>>;
    remove(id: number): Promise<void>;
}
