import { CreateRegimeDto, UpdateRegimeDto, RegimeResponseDto } from 'libs/dto/regime/regime.dto';
import { PaginationQueryDto } from 'libs/dto/global/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class RegimeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createRegimeDto: CreateRegimeDto): Promise<RegimeResponseDto>;
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<RegimeResponseDto>>;
    findOne(id: number): Promise<RegimeResponseDto>;
    update(id: number, updateRegimeDto: UpdateRegimeDto): Promise<RegimeResponseDto>;
    remove(id: number): Promise<void>;
    findAllSimple(): Promise<RegimeResponseDto[]>;
    private toResponseDto;
}
