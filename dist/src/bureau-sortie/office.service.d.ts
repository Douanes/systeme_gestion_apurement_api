import { PrismaService } from 'prisma/prisma.service';
import { CreateBureauSortieDto, UpdateBureauSortieDto, BureauSortieResponseDto, BureauSortieWithRelationsDto } from 'libs/dto/bureau-sortie/office.dto';
import { BureauSortiePaginationQueryDto } from 'libs/dto/bureau-sortie/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
export declare class BureauSortieService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toResponseDto;
    create(createBureauSortieDto: CreateBureauSortieDto): Promise<BureauSortieResponseDto>;
    findAll(paginationQuery: BureauSortiePaginationQueryDto): Promise<PaginatedResponseDto<BureauSortieResponseDto>>;
    findOne(id: number): Promise<BureauSortieResponseDto | BureauSortieWithRelationsDto>;
    update(id: number, updateBureauSortieDto: UpdateBureauSortieDto): Promise<BureauSortieResponseDto>;
    remove(id: number): Promise<void>;
    findAllActive(): Promise<BureauSortieResponseDto[]>;
    activate(id: number): Promise<BureauSortieResponseDto>;
    deactivate(id: number): Promise<BureauSortieResponseDto>;
    getStatistics(id: number): Promise<{
        bureauId: number;
        totalDeclarations: number;
        totalAgents: number;
        totalOrdreMissions: number;
    }>;
}
