export type LicenseType = 'BUSINESS_REGISTRATION' | 'FOOD_SAFETY_CERT';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LicenseItem {
    licenseId: string;
    restaurantId: string;
    restaurantName: string;
    ownerAccountId: string;
    ownerEmail: string;
    approvedByAccountId: string | null;
    approvedByEmail: string | null;
    licenseType: LicenseType;
    licenseNumber: string;
    issueDate: string;
    expireDate: string | null;
    documentUrl: string;
    approvalStatus: ApprovalStatus;
    approvedAt: string | null;
    rejectionReason: string | null;
}

export interface LicenseFilters {
    licenseType: LicenseType | 'ALL';
    approvalStatus: ApprovalStatus | 'ALL';
}

export const licenseTypeLabels: Record<LicenseType | 'ALL', string> = {
    ALL: 'Tất cả loại',
    BUSINESS_REGISTRATION: 'Giấy phép kinh doanh',
    FOOD_SAFETY_CERT: 'Giấy chứng nhận ATTP',
};

export const approvalStatusLabels: Record<ApprovalStatus | 'ALL', string> = {
    ALL: 'Tất cả trạng thái',
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
};
