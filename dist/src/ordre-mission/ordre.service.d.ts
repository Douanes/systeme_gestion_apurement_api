import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrdreMissionDto, UpdateOrdreMissionDto, OrdreMissionResponseDto, OrdreMissionWithRelationsDto } from 'libs/dto/ordre-mission/mission.dto';
import { OrdreMissionPaginationQueryDto } from 'libs/dto/ordre-mission/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
export declare class OrdreMissionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toResponseDto;
    create(createOrdreMissionDto: CreateOrdreMissionDto): Promise<OrdreMissionResponseDto>;
    findAll(paginationQuery: OrdreMissionPaginationQueryDto): Promise<PaginatedResponseDto<OrdreMissionResponseDto>>;
    findOne(id: number, includeRelations?: boolean): Promise<OrdreMissionResponseDto | OrdreMissionWithRelationsDto>;
    update(id: number, updateOrdreMissionDto: UpdateOrdreMissionDto): Promise<OrdreMissionResponseDto>;
    remove(id: number): Promise<void>;
    getStatistics(id: number): Promise<{
        ordreMissionId: number;
        totalDeclarations: number;
        totalColis: number;
        totalConteneurs: number;
        totalCamions: number;
        totalVoitures: number;
    }>;
}
