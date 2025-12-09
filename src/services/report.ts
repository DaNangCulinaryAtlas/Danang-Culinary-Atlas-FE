import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';
import type { Report, ReportStatistics, UpdateReportStatusRequest, UpdateReportStatusResponse } from '@/types/report';

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
    const response = await instanceAxios.put<UpdateReportStatusResponse>(
        API_ENDPOINTS.ADMIN.REPORT_UPDATE_STATUS(reportId),
        data
    );
    return response.data;
};
