export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface Report {
    reportId: string;
    reason: string;
    status: ReportStatus;
    createdAt: string;
    processedAt: string | null;
}

export interface ReportStatistics {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    rejectedReports: number;
}

export interface UpdateReportStatusRequest {
    status: ReportStatus;
}

export interface UpdateReportStatusResponse {
    reportId: string;
    reason: string;
    status: ReportStatus;
    createdAt: string;
    processedAt: string;
}
