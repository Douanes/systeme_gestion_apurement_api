import {
    Controller,
    Get,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ModificationRequestService } from './modification-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModificationRequestQueryDto } from 'libs/dto/ordre-mission/modification-request-query.dto';
import { ModificationRequestResponseDto } from 'libs/dto/ordre-mission/mission.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Modification Requests')
@ApiBearerAuth('JWT-auth')
@Controller('modification-requests')
export class ModificationRequestListController {
    constructor(private readonly modificationRequestService: ModificationRequestService) {}

    @UseGuards(JwtAuthGuard)
    @Get('approved')
    @ApiOperation({ summary: 'Lister toutes les demandes de rectification approuvées' })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des demandes approuvées récupérée avec succès',
        type: ModificationRequestResponseDto,
        isArray: true 
    })
    async findAllApproved(
        @Query() query: ModificationRequestQueryDto,
        @Req() req,
    ) {
        return this.modificationRequestService.findAllApproved(query, req.user);
    }
}
