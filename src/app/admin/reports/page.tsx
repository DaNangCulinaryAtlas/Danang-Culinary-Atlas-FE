'use client';

import React, { useEffect, useState } from 'react';
import { ReportStatisticsCard } from '@/components/admin/ReportStatisticsCard';
import { ReportsTable } from '@/components/admin/ReportsTable';
import { getReportStatistics, getReports } from '@/services/report';
import type { Report, ReportStatistics } from '@/types/report';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [statistics, setStatistics] = useState<ReportStatistics | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, reportsData] = await Promise.all([
        getReportStatistics(),
        getReports(),
      ]);
      setStatistics(statsData);
      setReports(reportsData);
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports Management</h1>
        <p className="text-gray-600 mt-2">Manage and review user reports</p>
      </div>

      {statistics && <ReportStatisticsCard statistics={statistics} />}

      <ReportsTable reports={reports} onStatusUpdate={fetchData} />
    </div>
  );
}

