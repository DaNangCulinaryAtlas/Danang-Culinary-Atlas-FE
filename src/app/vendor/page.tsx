"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Utensils, MessageSquare, Loader2, FileText, Edit, CheckCircle, XCircle, Clock, Download, Eye, Image as ImageIcon } from "lucide-react"
import { vendorColors } from "@/configs/colors"
import { useVendorOverview } from "@/hooks/queries/useVendorOverview"
import { useVendorLicenses } from "@/hooks/queries/useVendorLicenses"
import { VendorRestaurantFormModal } from "@/components/vendor/VendorRestaurantFormModal"
import { LicenseImageModal } from "@/components/vendor/LicenseImageModal"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"

export default function VendorDashboard() {
    const router = useRouter()
    const { data: overview, isLoading: isLoadingOverview } = useVendorOverview()
    const { data: licenses, isLoading: isLoadingLicenses } = useVendorLicenses()
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

    const handleViewImage = (url: string) => {
        setSelectedImageUrl(url)
        setIsImageModalOpen(true)
    }

    const isPdfFile = (url: string) => {
        return url.toLowerCase().endsWith('.pdf') || url.includes('/documents/')
    }

    const handleDownloadPdf = async (url: string, licenseNumber: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `giay-phep-${licenseNumber}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            toast.error('Lỗi khi tải file', {
                position: 'top-right',
                autoClose: 2500,
            });
        }
    }

    const getApprovalStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 transition-colors cursor-default">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã duyệt
                    </Badge>
                )
            case 'REJECTED':
                return (
                    <Badge variant="destructive" className="hover:bg-red-700 transition-colors cursor-default">
                        <XCircle className="w-3 h-3 mr-1" />
                        Đã từ chối
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600 transition-colors cursor-default">
                        <Clock className="w-3 h-3 mr-1" />
                        Chờ duyệt
                    </Badge>
                )
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('vi-VN')
        } catch {
            return dateString
        }
    }

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
                    <div className="grid gap-3">
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
                        <button
                            onClick={() => router.push('/vendor/restaurants')}
                            className="w-full text-center px-6 py-4 rounded-lg transition-all duration-200 font-semibold hover:shadow-lg"
                            style={{
                                border: `2px solid ${vendorColors.accent.emerald}`,
                                color: '#047857',
                                background: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#D1FAE5'
                                e.currentTarget.style.borderColor = '#10B981'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white'
                                e.currentTarget.style.borderColor = vendorColors.accent.emerald
                            }}
                        >
                            Quản lý giấy phép
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Business Licenses Summary */}
            <Card
                className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white backdrop-blur-sm"
                style={{ borderColor: vendorColors.accent.emerald }}
            >
                <CardHeader
                    className="border-b"
                    style={{
                        background: `linear-gradient(to right, #D1FAE5, rgba(209, 250, 229, 0.5), white)`,
                        borderColor: '#A7F3D0'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-bold text-lg flex items-center gap-2" style={{ color: '#047857' }}>
                                <FileText className="w-5 h-5" />
                                Giấy phép
                            </CardTitle>
                            <CardDescription className="font-semibold" style={{ color: '#059669' }}>
                                Tổng quan giấy phép của bạn
                            </CardDescription>
                        </div>
                        <button
                            onClick={() => router.push('/vendor/restaurants')}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
                            style={{
                                background: '#047857',
                                color: 'white'
                            }}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoadingLicenses ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-500">Đang tải...</span>
                        </div>
                    ) : !licenses || licenses.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">Chưa có giấy phép nào</p>
                            <p className="text-sm mt-1">Vào trang quản lý quán ăn để thêm giấy phép</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* License Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg border-2" style={{ borderColor: '#D1FAE5', background: '#F0FDF4' }}>
                                    <div className="text-2xl font-bold" style={{ color: '#047857' }}>
                                        {licenses.filter(l => l.licenseType === 'BUSINESS_REGISTRATION').length}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Giấy phép ĐKKD</div>
                                </div>
                                <div className="p-3 rounded-lg border-2" style={{ borderColor: '#D1FAE5', background: '#F0FDF4' }}>
                                    <div className="text-2xl font-bold" style={{ color: '#047857' }}>
                                        {licenses.filter(l => l.licenseType === 'FOOD_SAFETY_CERT').length}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Chứng nhận ATVSTP</div>
                                </div>
                            </div>

                            {/* Status Breakdown */}
                            <div className="pt-3 border-t">
                                <div className="text-sm font-semibold text-gray-700 mb-2">Trạng thái:</div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        <span className="text-xs font-medium text-green-700">
                                            {licenses.filter(l => l.approvalStatus === 'APPROVED').length} Đã duyệt
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200">
                                        <Clock className="w-3 h-3 text-yellow-600" />
                                        <span className="text-xs font-medium text-yellow-700">
                                            {licenses.filter(l => l.approvalStatus === 'PENDING').length} Chờ duyệt
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                                        <XCircle className="w-3 h-3 text-red-600" />
                                        <span className="text-xs font-medium text-red-700">
                                            {licenses.filter(l => l.approvalStatus === 'REJECTED').length} Bị từ chối
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Restaurant Form Modal */}
            <VendorRestaurantFormModal
                open={isRestaurantModalOpen}
                onOpenChange={setIsRestaurantModalOpen}
            />

            {/* License Image Modal */}
            <LicenseImageModal
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
                imageUrl={selectedImageUrl}
            />
        </div>
    )
}
