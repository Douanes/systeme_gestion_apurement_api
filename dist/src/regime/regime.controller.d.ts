import { RegimeService } from './regime.service';
import { CreateRegimeDto, UpdateRegimeDto, RegimeResponseDto } from 'libs/dto/regime/regime.dto';
import { PaginationQueryDto } from 'libs/dto/global/pagination.dto';
import { PaginatedResponseDto } from 'libs/dto/global/response.dto';
export declare class RegimeController {
    private readonly regimeService;
    constructor(regimeService: RegimeService);
    create(createRegimeDto: CreateRegimeDto): Promise<RegimeResponseDto>;
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<RegimeResponseDto>>;
    findAllSimple(): Promise<RegimeResponseDto[]>;
    findOne(id: number): Promise<RegimeResponseDto>;
    update(id: number, updateRegimeDto: UpdateRegimeDto): Promise<RegimeResponseDto>;
    remove(id: number): Promise<void>;
}
