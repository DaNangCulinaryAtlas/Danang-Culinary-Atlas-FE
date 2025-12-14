import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';
import type { Report, ReportStatistics, UpdateReportStatusRequest, UpdateReportStatusResponse, CreateReportRequest, CreateReportResponse } from '@/types/report';

/**
 * Get report statistics
 */
export const getReportStatistics = async (): Promise<ReportStatistics> => {
    const response = await instanceAxios.get<ReportStatistics>(API_ENDPOINTS.ADMIN.REPORTS_STATISTICS);
    return response.data;
};

/**
 * Get list of reports
 */
export const getReports = async (): Promise<Report[]> => {
    const response = await instanceAxios.get<Report[]>(API_ENDPOINTS.ADMIN.REPORTS_LIST);
    return response.data;
};

/**
 * Update report status
 */
export const updateReportStatus = async (
    reportId: string,
    data: UpdateReportStatusRequest
): Promise<UpdateReportStatusResponse> => {
    const response = await instanceAxios.patch<UpdateReportStatusResponse>(
        API_ENDPOINTS.ADMIN.REPORT_UPDATE_STATUS(reportId),
        data
    );
    return response.data;
};

/**
 * Create a new report for a restaurant or review
 */
export const createReport = async (
    data: CreateReportRequest
): Promise<CreateReportResponse> => {
    const response = await instanceAxios.post<CreateReportResponse>(
        API_ENDPOINTS.ADMIN.REPORT_CREATE,
        data
    );
    return response.data;
};

// Backward compatibility
export const createRestaurantReport = createReport;
