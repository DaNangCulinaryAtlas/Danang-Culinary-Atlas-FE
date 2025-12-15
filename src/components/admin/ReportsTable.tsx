'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import type { Report, ReportStatus } from '@/types/report';
import { updateReportStatus } from '@/services/report';
import { toast } from 'sonner';

interface ReportsTableProps {
    reports: Report[];
    onStatusUpdate: () => void;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onStatusUpdate }) => {
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

    const filteredReports = reports.filter((report) => {
        if (filterStatus === 'ALL') return true;
        return report.status === filterStatus;
    });

    const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
        try {
            setUpdatingReportId(reportId);
            await updateReportStatus(reportId, { status: newStatus });
            toast.success('Report status updated successfully');
            onStatusUpdate();
        } catch (error) {
            console.error('Failed to update report status:', error);
            toast.error('Failed to update report status');
        } finally {
            setUpdatingReportId(null);
        }
    };

    const getStatusBadge = (status: ReportStatus) => {
        const variants: Record<ReportStatus, { variant: 'default' | 'destructive' | 'outline' | 'secondary'; className: string }> = {
            PENDING: { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
            RESOLVED: { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-300' },
            REJECTED: { variant: 'outline', className: 'bg-red-50 text-red-700 border-red-300' },
        };

        return (
            <Badge variant={variants[status].variant} className={variants[status].className}>
                {status}
            </Badge>
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Reports Management</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Filter by status:</span>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Report ID</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Processed At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                    No reports found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.reportId}>
                                    <TableCell className="font-mono text-xs">
                                        {report.reportId.substring(0, 20)}...
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{report.reason}</TableCell>
                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                    <TableCell>
                                        {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell>
                                        {report.processedAt
                                            ? format(new Date(report.processedAt), 'MMM dd, yyyy HH:mm')
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {report.status === 'PENDING' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-300"
                                                        onClick={() => handleStatusChange(report.reportId, 'RESOLVED')}
                                                        disabled={updatingReportId === report.reportId}
                                                    >
                                                        Resolve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-300"
                                                        onClick={() => handleStatusChange(report.reportId, 'REJECTED')}
                                                        disabled={updatingReportId === report.reportId}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {report.status !== 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(report.reportId, 'PENDING')}
                                                    disabled={updatingReportId === report.reportId}
                                                >
                                                    Reopen
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
