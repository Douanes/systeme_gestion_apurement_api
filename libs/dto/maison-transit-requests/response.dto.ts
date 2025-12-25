import { RequestStatus, DocumentType } from './enums';

export class RequestDocumentDto {
    id: number;
    type: DocumentType;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
    uploadedAt: Date;
}

export class MaisonTransitRequestResponseDto {
    id: number;
    email: string;
    companyName: string;
    phone?: string;
    address?: string;
    ninea?: string;
    registreCommerce?: string;
    status: RequestStatus;
    invitationToken?: string; // Only for admin/inviter
    tokenExpiresAt: Date;
    invitedById: number;
    reviewedById?: number;
    reviewedAt?: Date;
    rejectionReason?: string;
    activatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    documents?: RequestDocumentDto[];
}

export class InvitationResponseDto {
    message: string;
    invitationToken: string;
    expiresAt: Date;
}

export class PaginatedRequestsResponseDto {
    data: MaisonTransitRequestResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class RequestFilterDto {
    status?: RequestStatus;
    email?: string;
    search?: string;
    page?: number;
    limit?: number;
}
