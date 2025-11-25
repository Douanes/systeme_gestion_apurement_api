import { BureauSortieService } from './office.service';
import { CreateBureauSortieDto, UpdateBureauSortieDto, BureauSortieResponseDto, BureauSortieWithRelationsDto } from 'libs/dto/bureau-sortie/office.dto';
import { BureauSortiePaginationQueryDto } from 'libs/dto/bureau-sortie/pagination.dto';
import { PaginatedResponseDto, SuccessResponseDto } from 'libs/dto/global/response.dto';
export declare class BureauSortieController {
    private readonly bureauSortieService;
    constructor(bureauSortieService: BureauSortieService);
    create(createBureauSortieDto: CreateBureauSortieDto): Promise<BureauSortieResponseDto>;
    findAll(paginationQuery: BureauSortiePaginationQueryDto): Promise<PaginatedResponseDto<BureauSortieResponseDto>>;
    findAllActive(): Promise<BureauSortieResponseDto[]>;
    findOne(id: number): Promise<BureauSortieResponseDto | BureauSortieWithRelationsDto>;
    getStatistics(id: number): Promise<{
        bureauId: number;
        totalDeclarations: number;
        totalAgents: number;
        totalOrdreMissions: number;
    }>;
    update(id: number, updateBureauSortieDto: UpdateBureauSortieDto): Promise<BureauSortieResponseDto>;
    activate(id: number): Promise<SuccessResponseDto<BureauSortieResponseDto>>;
    deactivate(id: number): Promise<SuccessResponseDto<BureauSortieResponseDto>>;
    remove(id: number): Promise<void>;
}
