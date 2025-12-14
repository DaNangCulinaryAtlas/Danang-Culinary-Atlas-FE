"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Utensils, MessageSquare, Loader2 } from "lucide-react"
import { vendorColors } from "@/configs/colors"
import { useVendorOverview } from "@/hooks/queries/useVendorOverview"
import { VendorRestaurantFormModal } from "@/components/vendor/VendorRestaurantFormModal"

export default function VendorDashboard() {
    const { data: overview, isLoading: isLoadingOverview } = useVendorOverview()
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false)

    const metrics = [
        {
            title: "Quán ăn của tôi",
            value: overview?.totalRestaurants?.toString() || "0",
            icon: Store,
            description: "Đang hoạt động",
            trend: "",
        },
        {
            title: "Tổng món ăn",
            value: overview?.totalDishes?.toString() || "0",
            icon: Utensils,
            description: "Đã đăng ký",
            trend: "",
        },
        {
            title: "Đánh giá",
            value: overview?.totalReviews?.toString() || "0",
            icon: MessageSquare,
            description: "Tổng số đánh giá",
            trend: "",
        },
    ]

    const metricColors = [
        {
            bg: vendorColors.gradients.primary,
            iconBg: vendorColors.gradients.primarySoft,
            value: vendorColors.primary[700],
            border: vendorColors.primary[200],
            text: vendorColors.primary[700]
        },
        {
            bg: `linear-gradient(135deg, ${vendorColors.accent.emerald}, #059669, #047857)`,
            iconBg: `linear-gradient(135deg, #34D399, ${vendorColors.accent.emerald})`,
            value: '#047857',
            border: '#A7F3D0',
            text: vendorColors.accent.emerald
        },
        {
            bg: `linear-gradient(135deg, ${vendorColors.accent.amber}, #D97706, #B45309)`,
            iconBg: `linear-gradient(135deg, #FBBF24, ${vendorColors.accent.amber})`,
            value: '#B45309',
            border: '#FDE68A',
            text: vendorColors.accent.amber
        },
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div
                className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-white shadow-2xl"
                style={{ background: vendorColors.gradients.primary }}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
                <div className="relative">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 drop-shadow-sm">Chào mừng trở lại!</h1>
                    <p className="text-lg md:text-xl font-medium" style={{ color: vendorColors.primary[200] }}>
                        Quản lý quán ăn và món ăn của bạn một cách hiệu quả
                    </p>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon
                    const colors = metricColors[index % metricColors.length]

                    return (
                        <Card
                            key={metric.title}
                            className="overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white backdrop-blur-sm group"
                            style={{ borderColor: colors.border }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-6 pt-6">
                                <CardTitle className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {metric.title}
                                </CardTitle>
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white transition-transform group-hover:scale-110"
                                    style={{ background: colors.iconBg }}
                                >
                                    {isLoadingOverview ? (
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    ) : (
                                        <Icon className="h-6 w-6 text-white" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ color: colors.value }}>
                                    {metric.value}
                                </div>
                                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                                    {metric.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <Card
                className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white backdrop-blur-sm"
                style={{ borderColor: vendorColors.primary[200] }}
            >
                <CardHeader
                    className="border-b"
                    style={{
                        background: `linear-gradient(to right, ${vendorColors.primary[50]}, rgba(250, 245, 255, 0.5), white)`,
                        borderColor: vendorColors.primary[100]
                    }}
                >
                    <CardTitle className="font-bold text-lg" style={{ color: vendorColors.primary[700] }}>
                        Quản lý nhanh
                    </CardTitle>
                    <CardDescription className="font-semibold" style={{ color: vendorColors.primary[600] }}>
                        Các thao tác thường dùng
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid ">
                        <button
                            onClick={() => setIsRestaurantModalOpen(true)}
                            className="w-full text-center px-6 py-4 rounded-lg transition-all duration-200 font-semibold hover:shadow-lg"
                            style={{
                                border: `2px solid ${vendorColors.primary[200]}`,
                                color: vendorColors.primary[700],
                                background: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = vendorColors.primary[50]
                                e.currentTarget.style.borderColor = vendorColors.primary[400]
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white'
                                e.currentTarget.style.borderColor = vendorColors.primary[200]
                            }}
                        >
                            + Thêm quán ăn mới
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Restaurant Form Modal */}
            <VendorRestaurantFormModal
                open={isRestaurantModalOpen}
                onOpenChange={setIsRestaurantModalOpen}
            />
        </div>
    )
}
