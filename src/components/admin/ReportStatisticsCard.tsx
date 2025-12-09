import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReportStatistics } from '@/types/report';

interface ReportStatisticsCardProps {
    statistics: ReportStatistics;
}

export const ReportStatisticsCard: React.FC<ReportStatisticsCardProps> = ({ statistics }) => {
    const stats = [
        {
            label: 'Total Reports',
            value: statistics.totalReports,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Pending',
            value: statistics.pendingReports,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            label: 'Resolved',
            value: statistics.resolvedReports,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Rejected',
            value: statistics.rejectedReports,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {stat.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`${stat.bgColor} rounded-lg p-4 flex items-center justify-center`}>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
