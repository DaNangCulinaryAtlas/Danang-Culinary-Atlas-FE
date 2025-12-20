export type LicenseType = 'BUSINESS_REGISTRATION' | 'FOOD_SAFETY_CERT';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface License {
    licenseId: string;
    restaurantId: string;
    restaurantName: string;
    ownerAccountId: string;
    ownerEmail: string;
    approvedByAccountId: string | null;
    approvedByEmail: string | null;
    licenseType: LicenseType;
    licenseNumber: string;
    issueDate: string; // ISO date string
    expireDate: string | null; // ISO date string
    documentUrl: string;
    approvalStatus: ApprovalStatus;
    approvedAt: string | null;
    rejectionReason: string | null;
}

export interface CreateLicenseRequest {
    restaurantId: string;
    licenseNumber: string;
    issueDate: string;
    expireDate?: string;
    documentUrl: string;
    licenseType: LicenseType;
}

export interface UpdateLicenseRequest {
    restaurantId?: string;
    licenseNumber: string;
    issueDate: string;
    expireDate?: string;
    documentUrl: string;
    licenseType?: LicenseType;
}
