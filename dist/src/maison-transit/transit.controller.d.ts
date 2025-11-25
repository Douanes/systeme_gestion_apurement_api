import { MaisonTransitService } from './transit.service';
import { CreateMaisonTransitDto, UpdateMaisonTransitDto, MaisonTransitResponseDto, MaisonTransitWithRelationsDto } from 'libs/dto/maison-transit/transit.dto';
import { MaisonTransitPaginationQueryDto } from 'libs/dto/maison-transit/pagination.dto';
import { PaginatedResponseDto, SuccessResponseDto } from 'libs/dto/global/response.dto';
export declare class MaisonTransitController {
    private readonly maisonTransitService;
    constructor(maisonTransitService: MaisonTransitService);
    create(createMaisonTransitDto: CreateMaisonTransitDto): Promise<MaisonTransitResponseDto>;
    findAll(paginationQuery: MaisonTransitPaginationQueryDto): Promise<PaginatedResponseDto<MaisonTransitResponseDto>>;
    findOne(id: number): Promise<MaisonTransitResponseDto | MaisonTransitWithRelationsDto>;
    getStatistics(id: number): Promise<{
        maisonTransitId: number;
        totalDepositaires: number;
        totalDeclarations: number;
    }>;
    update(id: number, updateMaisonTransitDto: UpdateMaisonTransitDto): Promise<MaisonTransitResponseDto>;
    activate(id: number): Promise<SuccessResponseDto<MaisonTransitResponseDto>>;
    deactivate(id: number): Promise<SuccessResponseDto<MaisonTransitResponseDto>>;
    remove(id: number): Promise<void>;
}
