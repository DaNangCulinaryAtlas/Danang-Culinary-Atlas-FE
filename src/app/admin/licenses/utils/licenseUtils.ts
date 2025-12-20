import { LicenseType, ApprovalStatus } from '../types';

export function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return dateString;
    }
}

export function getLicenseTypeLabel(type: LicenseType): string {
    switch (type) {
        case 'BUSINESS_REGISTRATION':
            return 'Giấy phép kinh doanh';
        case 'FOOD_SAFETY_CERT':
            return 'Giấy chứng nhận ATTP';
        default:
            return type;
    }
}

export function getApprovalStatusLabel(status: ApprovalStatus): string {
    switch (status) {
        case 'PENDING':
            return 'Chờ duyệt';
        case 'APPROVED':
            return 'Đã duyệt';
        case 'REJECTED':
            return 'Từ chối';
        default:
            return status;
    }
}

export function getLicenseTypeColor(type: LicenseType): { bg: string; text: string } {
    switch (type) {
        case 'BUSINESS_REGISTRATION':
            return { bg: 'bg-blue-100', text: 'text-blue-700' };
        case 'FOOD_SAFETY_CERT':
            return { bg: 'bg-green-100', text: 'text-green-700' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
}

export function getApprovalStatusColor(status: ApprovalStatus): { bg: string; text: string } {
    switch (status) {
        case 'PENDING':
            return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
        case 'APPROVED':
            return { bg: 'bg-green-100', text: 'text-green-700' };
        case 'REJECTED':
            return { bg: 'bg-red-100', text: 'text-red-700' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
}

export function isLicenseExpired(expireDate: string | null): boolean {
    if (!expireDate) return false;
    try {
        const expire = new Date(expireDate);
        const now = new Date();
        return expire < now;
    } catch {
        return false;
    }
}

export function isValidImageUrl(url: string | null): boolean {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
}
