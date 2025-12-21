"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { vendorColors } from "@/configs/colors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Clock, FileText, Eye, Store, Loader2, Star, Plus, Pencil, Trash2, CheckCircle, XCircle, AlertCircle, Download, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useVendorRestaurants } from "../../../hooks/queries/useVendorRestaurants"
import MiniMap from "./components/MiniMap"
import type { Restaurant } from "./types"
import { useAppSelector } from "@/hooks/useRedux"
import { VendorRestaurantFormModal } from "@/components/vendor/VendorRestaurantFormModal"
import { VendorConfirmDeleteModal } from "@/components/vendor/VendorConfirmDeleteModal"
import { useDeleteRestaurant } from "@/hooks/mutations/useRestaurantMutations"
import { useDeleteLicense } from "@/hooks/mutations/useLicenseMutations"
import { LicenseFormModal } from "@/components/vendor/LicenseFormModal"
import { LicenseImageModal } from "@/components/vendor/LicenseImageModal"
import { useVendorLicenses } from "@/hooks/queries/useVendorLicenses"
import type { License } from "@/types/license"
import { toast } from "react-toastify"
export default function VendorRestaurantsPage() {
    const { user } = useAppSelector((state) => state.auth)
    const vendorId = user?.accountId || null
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null)
    const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false)
    const [selectedLicense, setSelectedLicense] = useState<License | null>(null)
    const [selectedRestaurantForLicense, setSelectedRestaurantForLicense] = useState<Restaurant | null>(null)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
    const [isDeleteLicenseModalOpen, setIsDeleteLicenseModalOpen] = useState(false)
    const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null)

    const deleteRestaurantMutation = useDeleteRestaurant()
    const deleteLicenseMutation = useDeleteLicense()
    const { data: licenses, isLoading: isLoadingLicenses } = useVendorLicenses()

    // Fetch all restaurants
    const { restaurants, isLoading, error, refetch } = useVendorRestaurants({
        vendorId,
    })

    // Search state
    const [searchQuery, setSearchQuery] = useState("")

    // Filter restaurants by search
    const filteredRestaurants = useMemo(() => {
        if (!searchQuery.trim()) return restaurants
        const query = searchQuery.toLowerCase()
        return restaurants.filter((r) =>
            r.name.toLowerCase().includes(query) ||
            r.address.toLowerCase().includes(query)
        )
    }, [restaurants, searchQuery])

    // Group by approval status
    const pendingRestaurants = useMemo(
        () => filteredRestaurants.filter((r) => r.approvalStatus === "PENDING"),
        [filteredRestaurants]
    )

    const approvedRestaurants = useMemo(
        () => filteredRestaurants.filter((r) => r.approvalStatus === "APPROVED"),
        [filteredRestaurants]
    )

    const rejectedRestaurants = useMemo(
        () => filteredRestaurants.filter((r) => r.approvalStatus === "REJECTED"),
        [filteredRestaurants]
    )

    // Modal handlers
    const handleCreateRestaurant = () => {
        setModalMode('create')
        setSelectedRestaurant(null)
        setIsRestaurantModalOpen(true)
    }

    const handleEditRestaurant = (restaurant: Restaurant) => {
        setModalMode('edit')
        setSelectedRestaurant(restaurant)
        setIsRestaurantModalOpen(true)
    }

    const handleDeleteRestaurant = (restaurant: Restaurant) => {
        setRestaurantToDelete(restaurant)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteRestaurant = async () => {
        if (restaurantToDelete) {
            await deleteRestaurantMutation.mutateAsync(restaurantToDelete.id)
            setIsDeleteModalOpen(false)
            setRestaurantToDelete(null)
        }
    }

    const handleAddLicense = (restaurant: Restaurant) => {
        setSelectedRestaurantForLicense(restaurant)
        setSelectedLicense(null)
        setIsLicenseModalOpen(true)
    }

    const handleEditLicense = (license: License, restaurant: Restaurant) => {
        setSelectedRestaurantForLicense(restaurant)
        setSelectedLicense(license)
        setIsLicenseModalOpen(true)
    }

    const handleDeleteLicense = (license: License) => {
        setLicenseToDelete(license)
        setIsDeleteLicenseModalOpen(true)
    }

    const confirmDeleteLicense = async () => {
        if (licenseToDelete) {
            await deleteLicenseMutation.mutateAsync(licenseToDelete.licenseId)
            setIsDeleteLicenseModalOpen(false)
            setLicenseToDelete(null)
        }
    }

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
                    <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:border-green-400 transition-colors cursor-default">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã duyệt
                    </Badge>
                )
            case 'REJECTED':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400 transition-colors cursor-default">
                        <XCircle className="w-3 h-3 mr-1" />
                        Bị từ chối
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600 transition-colors cursor-default">
                        <AlertCircle className="w-3 h-3 mr-1" />
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

    const getLicenseTypeLabel = (type: string) => {
        switch (type) {
            case 'BUSINESS_REGISTRATION':
                return 'Giấy phép đăng ký kinh doanh'
            case 'FOOD_SAFETY_CERT':
                return 'Giấy chứng nhận an toàn thực phẩm'
            default:
                return type
        }
    }

    // Get licenses for a specific restaurant
    const getRestaurantLicenses = (restaurantId: string) => {
        if (!licenses) return []
        return licenses.filter(license => license.restaurantId === restaurantId)
    }

    // Get status badge
    const getStatusBadge = (status: string, approvalStatus: string) => {
        if (approvalStatus === "PENDING") {
            return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Chờ duyệt</Badge>
        }
        if (approvalStatus === "REJECTED") {
            return <Badge className="bg-red-100 text-red-800 border-red-300">Bị từ chối</Badge>
        }
        if (status === "ACTIVE") {
            return <Badge className="bg-green-100 text-green-800 border-green-300">Hoạt động</Badge>
        }
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>
    }

    // Restaurant Card Component
    const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
        const restaurantLicenses = getRestaurantLicenses(restaurant.id)
        const businessLicense = restaurantLicenses.find(l => l.licenseType === 'BUSINESS_REGISTRATION')
        const foodSafetyLicense = restaurantLicenses.find(l => l.licenseType === 'FOOD_SAFETY_CERT')

        return (
            <Card
                className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white group"
                style={{ borderColor: vendorColors.primary[200] }}
            >
                <CardHeader className="pb-3">
                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                        {restaurant.image ? (
                            <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center">
                                <Store className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-xs text-gray-400">Chưa có hình ảnh</p>
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-lg font-bold truncate" style={{ color: vendorColors.primary[700] }}>
                        {restaurant.name}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {restaurant.address}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                                {restaurant.averageRating?.toFixed(1) || "0.0"} ({restaurant.totalReviews || 0})
                            </span>
                        </div>
                        {getStatusBadge(restaurant.status, restaurant.approvalStatus)}
                    </div>

                    {restaurant.approvalStatus === "REJECTED" && restaurant.rejectionReason && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-xs text-red-700">
                                <strong>Lý do từ chối:</strong> {restaurant.rejectionReason}
                            </p>
                        </div>
                    )}

                    {/* License Status */}
                    <div className="mb-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-600 mb-1">Giấy phép:</div>
                        <div className="space-y-1">
                            {businessLicense ? (
                                <div className="flex items-center justify-between text-xs p-1.5 bg-green-50 rounded border border-green-200">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        <span className="text-green-700">Đăng ký KD</span>
                                    </span>
                                    {getApprovalStatusBadge(businessLicense.approvalStatus)}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between text-xs p-1.5 bg-gray-50 rounded border border-gray-200">
                                    <span className="flex items-center gap-1">
                                        <XCircle className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-600">Chưa có ĐKKD</span>
                                    </span>
                                </div>
                            )}
                            {foodSafetyLicense ? (
                                <div className="flex items-center justify-between text-xs p-1.5 bg-green-50 rounded border border-green-200">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        <span className="text-green-700">An toàn TP</span>
                                    </span>
                                    {getApprovalStatusBadge(foodSafetyLicense.approvalStatus)}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between text-xs p-1.5 bg-gray-50 rounded border border-gray-200">
                                    <span className="flex items-center gap-1">
                                        <XCircle className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-600">Chưa có ATVSTP</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Chi tiết Quán ăn</DialogTitle>
                                    <DialogDescription>{restaurant.name}</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column - Restaurant Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Thông tin quán</h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">Tên quán:</span> {restaurant.name}
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 mt-0.5" />
                                                    <span>
                                                        <span className="font-medium">Địa chỉ:</span> {restaurant.address}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Clock className="h-4 w-4 mt-0.5" />
                                                    <span>
                                                        <span className="font-medium">Giờ mở cửa:</span>{" "}
                                                        {Object.keys(restaurant.openingHours || {}).length > 0
                                                            ? JSON.stringify(restaurant.openingHours)
                                                            : "Chưa có thông tin"}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <FileText className="h-4 w-4 mt-0.5" />
                                                    <span>
                                                        <span className="font-medium">Trạng thái:</span>{" "}
                                                        {getStatusBadge(restaurant.status, restaurant.approvalStatus)}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Star className="h-4 w-4 mt-0.5 text-yellow-500" />
                                                    <span>
                                                        <span className="font-medium">Đánh giá:</span>{" "}
                                                        {restaurant.averageRating?.toFixed(1) || "0.0"} ({restaurant.totalReviews || 0} đánh giá)
                                                    </span>
                                                </div>
                                                {restaurant.createdAt && (
                                                    <div>
                                                        <span className="font-medium">Ngày tạo:</span>{" "}
                                                        {new Date(restaurant.createdAt).toLocaleString("vi-VN")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {restaurant.approvalStatus === "REJECTED" && restaurant.rejectionReason && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                                <h4 className="font-semibold text-red-700 mb-1">Lý do từ chối</h4>
                                                <p className="text-sm text-red-600">{restaurant.rejectionReason}</p>
                                            </div>
                                        )}

                                        {/* Licenses Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold">Giấy phép</h3>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAddLicense(restaurant)}
                                                    className="h-7"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Thêm
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {restaurantLicenses.length === 0 ? (
                                                    <div className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-md">
                                                        Chưa có giấy phép nào
                                                    </div>
                                                ) : (
                                                    restaurantLicenses.map((license) => (
                                                        <div key={license.licenseId} className="border rounded-md p-3 space-y-2 bg-gray-50">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium">{getLicenseTypeLabel(license.licenseType)}</span>
                                                                {getApprovalStatusBadge(license.approvalStatus)}
                                                            </div>
                                                            <div className="text-xs space-y-1 text-gray-600">
                                                                <div><span className="font-medium">Số GP:</span> {license.licenseNumber}</div>
                                                                <div><span className="font-medium">Ngày cấp:</span> {formatDate(license.issueDate)}</div>
                                                                {license.expireDate && (
                                                                    <div><span className="font-medium">Hết hạn:</span> {formatDate(license.expireDate)}</div>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 pt-1">
                                                                {isPdfFile(license.documentUrl) ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleDownloadPdf(license.documentUrl, license.licenseNumber)}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        <Download className="h-3 w-3 mr-1" />
                                                                        Tải xuống
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleViewImage(license.documentUrl)}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        <Eye className="h-3 w-3 mr-1" />
                                                                        Xem
                                                                    </Button>
                                                                )}
                                                                {/* Chỉ hiển thị nút Sửa khi giấy phép chưa được duyệt */}
                                                                {license.approvalStatus !== 'APPROVED' && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleEditLicense(license, restaurant)}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        <Pencil className="h-3 w-3 mr-1" />
                                                                        Sửa
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleDeleteLicense(license)}
                                                                    className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                                    Xóa
                                                                </Button>
                                                            </div>
                                                            {license.rejectionReason && (
                                                                <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
                                                                    <strong>Lý do từ chối:</strong> {license.rejectionReason}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-2">Bản đồ</h3>
                                            <MiniMap
                                                latitude={restaurant.latitude}
                                                longitude={restaurant.longitude}
                                                restaurantName={restaurant.name}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column - Images */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Hình ảnh quán ăn</h3>
                                            <div className="space-y-3">
                                                <div className="h-48 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                                    {restaurant.image ? (
                                                        <Image
                                                            src={restaurant.image}
                                                            alt={restaurant.name}
                                                            width={400}
                                                            height={260}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                                                            <Store className="h-8 w-8 mb-1 text-gray-400" />
                                                            Chưa có ảnh đại diện
                                                        </div>
                                                    )}
                                                </div>
                                                {restaurant.subPhotos && restaurant.subPhotos.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {restaurant.subPhotos.slice(0, 9).map((url, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative h-20 rounded-md overflow-hidden bg-muted"
                                                            >
                                                                <Image
                                                                    src={url}
                                                                    alt={`${restaurant.name} - hình ${index + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleEditRestaurant(restaurant)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteRestaurant(restaurant)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div
                className="rounded-xl p-5 md:p-6 text-white shadow-lg"
                style={{ background: vendorColors.gradients.primary }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Quán ăn</h1>
                        <p className="text-sm md:text-base font-medium" style={{ color: vendorColors.primary[200] }}>
                            Xem và quản lý các quán ăn của bạn
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateRestaurant}
                        className="font-semibold"
                        style={{
                            background: 'white',
                            color: vendorColors.primary[600]
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm quán ăn
                    </Button>
                </div>
            </div>


            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        Tất cả
                        <Badge variant="secondary" className="ml-2">
                            {filteredRestaurants.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Đã duyệt
                        <Badge className="ml-2 bg-green-100 text-green-800">
                            {approvedRestaurants.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Chờ duyệt
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                            {pendingRestaurants.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Bị từ chối
                        <Badge className="ml-2 bg-red-100 text-red-800">
                            {rejectedRestaurants.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                {/* All Restaurants */}
                <TabsContent value="all" className="space-y-4">
                    <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: vendorColors.primary[200] }}>
                        <CardHeader
                            className="text-white"
                            style={{ background: vendorColors.gradients.primary }}
                        >
                            <CardTitle className="text-white text-xl font-bold">Tất cả quán ăn</CardTitle>
                            <CardDescription className="font-semibold" style={{ color: vendorColors.primary[200] }}>
                                Tổng số: {filteredRestaurants.length} quán
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-10 text-muted-foreground">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang tải danh sách quán ăn...
                                </div>
                            ) : error ? (
                                <div className="py-8 text-center text-sm text-red-600">{error}</div>
                            ) : filteredRestaurants.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">Chưa có quán ăn nào</p>
                                    <p className="text-sm mt-1">Hãy thêm quán ăn đầu tiên của bạn</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredRestaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Approved Restaurants */}
                <TabsContent value="approved" className="space-y-4">
                    <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: vendorColors.primary[200] }}>
                        <CardHeader
                            className="text-white"
                            style={{ background: vendorColors.gradients.primary }}
                        >
                            <CardTitle className="text-white text-xl font-bold">Quán ăn đã được duyệt</CardTitle>
                            <CardDescription className="font-semibold" style={{ color: vendorColors.primary[200] }}>
                                Tổng số: {approvedRestaurants.length} quán
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {approvedRestaurants.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Không có quán ăn nào đã được duyệt
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {approvedRestaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pending Restaurants */}
                <TabsContent value="pending" className="space-y-4">
                    <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: vendorColors.primary[200] }}>
                        <CardHeader
                            className="text-white"
                            style={{ background: vendorColors.gradients.primary }}
                        >
                            <CardTitle className="text-white text-xl font-bold">Quán ăn chờ duyệt</CardTitle>
                            <CardDescription className="font-semibold" style={{ color: vendorColors.primary[200] }}>
                                Tổng số: {pendingRestaurants.length} quán
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {pendingRestaurants.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Không có quán ăn nào đang chờ duyệt
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {pendingRestaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Rejected Restaurants */}
                <TabsContent value="rejected" className="space-y-4">
                    <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: vendorColors.primary[200] }}>
                        <CardHeader
                            className="text-white"
                            style={{ background: vendorColors.gradients.primary }}
                        >
                            <CardTitle className="text-white text-xl font-bold">Quán ăn bị từ chối</CardTitle>
                            <CardDescription className="font-semibold" style={{ color: vendorColors.primary[200] }}>
                                Tổng số: {rejectedRestaurants.length} quán
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {rejectedRestaurants.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Không có quán ăn nào bị từ chối
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {rejectedRestaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Restaurant Form Modal */}
            <VendorRestaurantFormModal
                open={isRestaurantModalOpen}
                onOpenChange={setIsRestaurantModalOpen}
                restaurant={selectedRestaurant}
                mode={modalMode}
            />

            {/* Delete Confirmation Modal */}
            <VendorConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setRestaurantToDelete(null)
                }}
                onConfirm={confirmDeleteRestaurant}
                isLoading={deleteRestaurantMutation.isPending}
                restaurantName={restaurantToDelete?.name || ''}
            />

            {/* License Form Modal */}
            <LicenseFormModal
                open={isLicenseModalOpen}
                onOpenChange={setIsLicenseModalOpen}
                license={selectedLicense}
                restaurantId={selectedRestaurantForLicense?.id}
                restaurantName={selectedRestaurantForLicense?.name}
                restaurants={restaurants.map(r => ({ id: r.id, name: r.name }))}
            />

            {/* Delete License Confirmation Modal */}
            <Dialog open={isDeleteLicenseModalOpen} onOpenChange={setIsDeleteLicenseModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa giấy phép</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa giấy phép này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {licenseToDelete && (
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold">Loại giấy phép:</span> {getLicenseTypeLabel(licenseToDelete.licenseType)}</p>
                                <p><span className="font-semibold">Số giấy phép:</span> {licenseToDelete.licenseNumber}</p>
                                <p><span className="font-semibold">Nhà hàng:</span> {licenseToDelete.restaurantName}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteLicenseModalOpen(false)
                                setLicenseToDelete(null)
                            }}
                            disabled={deleteLicenseMutation.isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteLicense}
                            disabled={deleteLicenseMutation.isPending}
                        >
                            {deleteLicenseMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                'Xác nhận xóa'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* License Image Modal */}
            <LicenseImageModal
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
                imageUrl={selectedImageUrl}
            />
        </div>
    )
}
