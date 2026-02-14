import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
    SystemParameterResponseDto,
    UpdateSystemParameterContactDto,
} from 'libs/dto/system-parameter';

@Injectable()
export class SystemParameterService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Récupérer ou créer l'enregistrement unique des paramètres système
     */
    private async getOrCreateParameter() {
        let param = await this.prisma.systemParameter.findFirst({
            include: {
                chefBureau: true,
                chefSection: true,
            },
        });

        if (!param) {
            param = await this.prisma.systemParameter.create({
                data: {},
                include: {
                    chefBureau: true,
                    chefSection: true,
                },
            });
        }

        return param;
    }

    /**
     * Récupérer les paramètres système
     */
    async findOne(): Promise<SystemParameterResponseDto> {
        const param = await this.getOrCreateParameter();
        return param as SystemParameterResponseDto;
    }

    /**
     * Mettre à jour les informations de contact
     */
    async updateContact(
        dto: UpdateSystemParameterContactDto,
    ): Promise<SystemParameterResponseDto> {
        const param = await this.getOrCreateParameter();

        const updated = await this.prisma.systemParameter.update({
            where: { id: param.id },
            data: {
                phone: dto.phone !== undefined ? dto.phone : undefined,
                email: dto.email !== undefined ? dto.email : undefined,
                address: dto.address !== undefined ? dto.address : undefined,
                updatedAt: new Date(),
            },
            include: {
                chefBureau: true,
                chefSection: true,
            },
        });

        return updated as SystemParameterResponseDto;
    }

    /**
     * Vérifier qu'un agent n'est pas déjà chef/adjoint/membre d'une escouade
     */
    private async checkAgentEscouadeMembership(
        agentId: number,
    ): Promise<{ escouadeName: string; role: string } | null> {
        // Vérifier si l'agent est chef d'une escouade
        const asChef = await this.prisma.escouade.findFirst({
            where: { chefId: agentId, deletedAt: null },
            select: { name: true },
        });
        if (asChef) {
            return { escouadeName: asChef.name, role: 'CHEF' };
        }

        // Vérifier si l'agent est adjoint d'une escouade
        const asAdjoint = await this.prisma.escouade.findFirst({
            where: { adjointId: agentId, deletedAt: null },
            select: { name: true },
        });
        if (asAdjoint) {
            return { escouadeName: asAdjoint.name, role: 'ADJOINT' };
        }

        // Vérifier si l'agent est membre d'une escouade
        const asMember = await this.prisma.escouadeAgents.findFirst({
            where: { agentId },
            include: { escouade: { select: { name: true } } },
        });
        if (asMember) {
            return { escouadeName: asMember.escouade.name, role: 'MEMBRE' };
        }

        return null;
    }

    /**
     * Assigner un chef de bureau
     */
    async assignChefBureau(agentId: number): Promise<SystemParameterResponseDto> {
        const agent = await this.prisma.agent.findUnique({
            where: { id: agentId },
        });

        if (!agent) {
            throw new NotFoundException(`Agent avec l'ID ${agentId} non trouvé`);
        }

        const param = await this.getOrCreateParameter();

        // Vérifier que l'agent n'est pas déjà chef de section
        if (param.chefSectionId === agentId) {
            throw new BadRequestException(
                'Cet agent est déjà chef de section. Un agent ne peut pas être chef de bureau et chef de section en même temps',
            );
        }

        // Vérifier l'exclusivité avec les escouades
        const membership = await this.checkAgentEscouadeMembership(agentId);
        if (membership) {
            throw new BadRequestException(
                `Cet agent est déjà ${membership.role} de l'escouade "${membership.escouadeName}". ` +
                'Un agent ne peut appartenir qu\'à une seule affectation',
            );
        }

        const updated = await this.prisma.systemParameter.update({
            where: { id: param.id },
            data: {
                chefBureauId: agentId,
                updatedAt: new Date(),
            },
            include: {
                chefBureau: true,
                chefSection: true,
            },
        });

        return updated as SystemParameterResponseDto;
    }

    /**
     * Retirer le chef de bureau
     */
    async removeChefBureau(): Promise<SystemParameterResponseDto> {
        const param = await this.getOrCreateParameter();

        if (!param.chefBureauId) {
            throw new BadRequestException('Aucun chef de bureau n\'est assigné');
        }

        const updated = await this.prisma.systemParameter.update({
            where: { id: param.id },
            data: {
                chefBureauId: null,
                updatedAt: new Date(),
            },
            include: {
                chefBureau: true,
                chefSection: true,
            },
        });

        return updated as SystemParameterResponseDto;
    }

    /**
     * Assigner un chef de section
     */
    async assignChefSection(agentId: number): Promise<SystemParameterResponseDto> {
        const agent = await this.prisma.agent.findUnique({
            where: { id: agentId },
        });

        if (!agent) {
            throw new NotFoundException(`Agent avec l'ID ${agentId} non trouvé`);
        }

        const param = await this.getOrCreateParameter();

        // Vérifier que l'agent n'est pas déjà chef de bureau
        if (param.chefBureauId === agentId) {
            throw new BadRequestException(
                'Cet agent est déjà chef de bureau. Un agent ne peut pas être chef de bureau et chef de section en même temps',
            );
        }

        // Vérifier l'exclusivité avec les escouades
        const membership = await this.checkAgentEscouadeMembership(agentId);
        if (membership) {
            throw new BadRequestException(
                `Cet agent est déjà ${membership.role} de l'escouade "${membership.escouadeName}". ` +
                'Un agent ne peut appartenir qu\'à une seule affectation',
            );
        }

        const updated = await this.prisma.systemParameter.update({
            where: { id: param.id },
            data: {
                chefSectionId: agentId,
                updatedAt: new Date(),
            },
            include: {
                chefBureau: true,
                chefSection: true,
            },
        });

        return updated as SystemParameterResponseDto;
    }

    /**
     * Retirer le chef de section
     */
    async removeChefSection(): Promise<SystemParameterResponseDto> {
        const param = await this.getOrCreateParameter();

        if (!param.chefSectionId) {
            throw new BadRequestException('Aucun chef de section n\'est assigné');
        }

        const updated = await this.prisma.systemParameter.update({
            where: { id: param.id },
            data: {
                chefSectionId: null,
                updatedAt: new Date(),
            },
            include: {
                chefBureau: true,
                chefSection: true,
            },
        });

        return updated as SystemParameterResponseDto;
    }
}
