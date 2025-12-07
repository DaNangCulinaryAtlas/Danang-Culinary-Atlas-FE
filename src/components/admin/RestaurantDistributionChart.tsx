"use client"

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { useRestaurantCountByTag } from '@/hooks/queries/useRestaurantCountByTag';
import { Loader2 } from 'lucide-react';
import { adminColors } from '@/configs/colors';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Màu sắc cho biểu đồ - palette đẹp mắt
const CHART_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#84CC16', // Lime
    '#F43F5E', // Rose
    '#0EA5E9', // Sky
    '#A855F7', // Purple
    '#22D3EE', // Cyan-400
    '#FB923C', // Orange-400
    '#4ADE80', // Green-400
    '#FB7185', // Rose-400
    '#818CF8', // Indigo-400
    '#2DD4BF', // Teal-400
];

export default function RestaurantDistributionChart() {
    const { data, isLoading, error } = useRestaurantCountByTag();

    if (isLoading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: adminColors.primary[500] }} />
                    <p className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-sm font-semibold text-red-600">
                        Không thể tải dữ liệu biểu đồ
                    </p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-sm font-semibold text-gray-500">
                        Chưa có dữ liệu
                    </p>
                </div>
            </div>
        );
    }

    // Chỉ lấy top 10 để biểu đồ không quá rối
    const topData = data.slice(0, 10);

    const chartData = {
        labels: topData.map(item => item.tagName),
        datasets: [
            {
                label: 'Số lượng quán ăn',
                data: topData.map(item => item.restaurantCount),
                backgroundColor: CHART_COLORS.slice(0, topData.length),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                    boxWidth: 15,
                    boxHeight: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} quán (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="h-[300px] relative">
            <Pie data={chartData} options={options} />
            {data.length > 10 && (
                <p className="text-xs text-gray-400 text-center mt-3">
                    * Hiển thị top 10 loại hình quán ăn phổ biến nhất
                </p>
            )}
        </div>
    );
}
