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
import { Input } from "@/components/ui/input"
import { MapPin, Clock, FileText, Eye, Store, Search, Loader2, Star, Plus } from "lucide-react"
import Image from "next/image"
import { useVendorRestaurants } from "../../../hooks/queries/useVendorRestaurants"
import MiniMap from "./components/MiniMap"
import type { Restaurant } from "./types"
import { useAppSelector } from "@/hooks/useRedux"
import { VendorRestaurantFormModal } from "@/components/vendor/VendorRestaurantFormModal"

export default function VendorRestaurantsPage() {
    const { user } = useAppSelector((state) => state.auth)
    const vendorId = user?.accountId || null
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false)

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
    const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
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

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full font-semibold"
                            style={{
                                background: vendorColors.gradients.primarySoft,
                                color: 'white'
                            }}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
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
            </CardContent>
        </Card>
    )

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
                        onClick={() => setIsRestaurantModalOpen(true)}
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
            />
        </div>
    )
}
