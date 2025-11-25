import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaisonTransitDto, UpdateMaisonTransitDto, MaisonTransitResponseDto, MaisonTransitWithRelationsDto } from 'libs/dto/maison-transit/transit.dto';
import { MaisonTransitPaginationQueryDto } from 'libs/dto/maison-transit/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
export declare class MaisonTransitService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toResponseDto;
    create(createMaisonTransitDto: CreateMaisonTransitDto): Promise<MaisonTransitResponseDto>;
    findAll(paginationQuery: MaisonTransitPaginationQueryDto): Promise<PaginatedResponseDto<MaisonTransitResponseDto>>;
    findOne(id: number): Promise<MaisonTransitResponseDto | MaisonTransitWithRelationsDto>;
    update(id: number, updateMaisonTransitDto: UpdateMaisonTransitDto): Promise<MaisonTransitResponseDto>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<MaisonTransitResponseDto>;
    deactivate(id: number): Promise<MaisonTransitResponseDto>;
    getStatistics(id: number): Promise<{
        maisonTransitId: number;
        totalDepositaires: number;
        totalDeclarations: number;
    }>;
}
