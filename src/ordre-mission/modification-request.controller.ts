import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    UseGuards,
    Req,
    ParseIntPipe,
} from '@nestjs/common';
import { ModificationRequestService } from './modification-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'libs/dto/auth';
import {
    CreateModificationRequestDto,
    ReviewModificationRequestDto,
    ModificationRequestResponseDto,
} from 'libs/dto/ordre-mission/mission.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Modification Requests')
@ApiBearerAuth('JWT-auth')
@Controller('mission-orders/:id/modification-requests')
export class ModificationRequestController {
    constructor(private readonly modificationRequestService: ModificationRequestService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TRANSITAIRE, UserRole.DECLARANT)
    @Post()
    @ApiOperation({ summary: 'Créer une demande de rectification' })
    async createRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateModificationRequestDto,
        @Req() req,
    ): Promise<ModificationRequestResponseDto> {
        return this.modificationRequestService.createRequest(id, dto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    @Patch(':requestId/review')
    @ApiOperation({ summary: 'Valider ou rejeter une demande de rectification' })
    async reviewRequest(
        @Param('requestId', ParseIntPipe) requestId: number,
        @Body() dto: ReviewModificationRequestDto,
        @Req() req,
    ): Promise<ModificationRequestResponseDto> {
        return this.modificationRequestService.reviewRequest(requestId, dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('latest')
    @ApiOperation({ summary: 'Récupérer la dernière demande de rectification' })
    async getLatest(@Param('id', ParseIntPipe) id: number): Promise<ModificationRequestResponseDto | null> {
        return this.modificationRequestService.getLatestRequest(id);
    }
}
