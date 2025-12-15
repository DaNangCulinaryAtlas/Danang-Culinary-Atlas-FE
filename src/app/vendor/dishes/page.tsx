"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { vendorColors } from "@/configs/colors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Utensils,
    Search,
    Loader2,
    Plus,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    Store,
    AlertCircle,
} from "lucide-react"
import { useVendorRestaurants } from "@/hooks/queries/useVendorRestaurants"
import { useVendorDishes } from "@/hooks/queries/useVendorDishes"
import { useAppSelector } from "@/hooks/useRedux"
import RestaurantSelector from "./components/RestaurantSelector"
import DishCard from "./components/DishCard"
import VendorDishFormModal from "./components/VendorDishFormModal"
import VendorDishDetailModal from "./components/VendorDishDetailModal"
import type { VendorDish } from "./types"

export default function VendorDishesPage() {
    const { user } = useAppSelector((state) => state.auth)
    const vendorId = user?.accountId || null

    // Fetch vendor's restaurants
    const {
        restaurants,
        isLoading: isLoadingRestaurants,
        error: restaurantsError
    } = useVendorRestaurants({ vendorId })

    // State for restaurant selection
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)

    // Auto-select first restaurant if available
    useEffect(() => {
        if (restaurants.length > 0 && !selectedRestaurantId) {
            setSelectedRestaurantId(restaurants[0].id)
        }
    }, [restaurants, selectedRestaurantId])

    // Get selected restaurant info
    const selectedRestaurant = useMemo(() => {
        return restaurants.find(r => r.id === selectedRestaurantId)
    }, [restaurants, selectedRestaurantId])

    // Pagination and filtering state
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(12)
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // Fetch dishes for selected restaurant
    const {
        dishes,
        totalPages,
        totalElements,
        isLoading: isLoadingDishes,
        isFetching,
        refetch
    } = useVendorDishes({
        restaurantId: selectedRestaurantId,
        page,
        size: pageSize,
        sortBy,
        sortDirection,
        enabled: !!selectedRestaurantId
    })

    // Modal states
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [selectedDish, setSelectedDish] = useState<VendorDish | null>(null)

    // Filter dishes by search and tab
    const filteredDishes = useMemo(() => {
        let filtered = [...dishes]

        // Filter by tab (approval status)
        switch (activeTab) {
            case "pending":
                filtered = filtered.filter(d => d.approvalStatus === "PENDING")
                break
            case "approved":
                filtered = filtered.filter(d => d.approvalStatus === "APPROVED")
                break
            case "rejected":
                filtered = filtered.filter(d => d.approvalStatus === "REJECTED")
                break
            default:
                // "all" - no filter
                break
        }

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(d =>
                d.name.toLowerCase().includes(query) ||
                d.description.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [dishes, activeTab, searchQuery])

    // Count by status
    const statusCounts = useMemo(() => ({
        all: dishes.length,
        pending: dishes.filter(d => d.approvalStatus === "PENDING").length,
        approved: dishes.filter(d => d.approvalStatus === "APPROVED").length,
        rejected: dishes.filter(d => d.approvalStatus === "REJECTED").length,
    }), [dishes])

    // Handlers
    const handleViewDish = (dish: VendorDish) => {
        setSelectedDish(dish)
        setDetailModalOpen(true)
    }

    const handleEditDish = (dish: VendorDish) => {
        setSelectedDish(dish)
        setFormModalOpen(true)
    }

    const handleCreateDish = () => {
        setSelectedDish(null)
        setFormModalOpen(true)
    }

    const handleRestaurantChange = (restaurantId: string) => {
        setSelectedRestaurantId(restaurantId)
        setPage(0)
        setSearchQuery("")
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setPage(0)
    }

    const handleSuccess = () => {
        refetch()
    }

    // Loading state
    if (isLoadingRestaurants) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto" style={{ color: vendorColors.primary[600] }} />
                    <p className="mt-4 text-gray-600">Đang tải danh sách quán ăn...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (restaurantsError) {
        return (
            <div className="flex items-center justify-center h-96">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-red-700">Có lỗi xảy ra</h3>
                        <p className="text-gray-600 mt-2">{restaurantsError}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // No restaurants state
    if (restaurants.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold" style={{ color: vendorColors.primary[700] }}>
                            Chưa có quán ăn nào
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Bạn cần tạo quán ăn trước khi có thể thêm món ăn.
                        </p>
                        <Button
                            className="mt-4 text-white"
                            style={{ background: vendorColors.gradients.primarySoft }}
                            onClick={() => window.location.href = '/vendor/restaurants'}
                        >
                            <Store className="mr-2 h-4 w-4" />
                            Tạo quán ăn mới
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div
                className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-2xl"
                style={{ background: vendorColors.gradients.primary }}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            <Utensils className="inline-block mr-3 h-8 w-8" />
                            Quản lý Món ăn
                        </h1>
                        <p className="text-lg" style={{ color: vendorColors.primary[200] }}>
                            Thêm, chỉnh sửa và quản lý các món ăn của bạn
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="font-semibold shadow-lg hover:shadow-xl transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                        }}
                        onClick={handleCreateDish}
                        disabled={!selectedRestaurantId}
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Thêm món mới
                    </Button>
                </div>
            </div>

            {/* Restaurant Selector */}
            <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: vendorColors.primary[700] }}>
                    {restaurants.length > 1 ? 'Chọn quán ăn' : 'Quán ăn của bạn'}
                </label>
                <RestaurantSelector
                    restaurants={restaurants}
                    selectedRestaurantId={selectedRestaurantId}
                    onSelectRestaurant={handleRestaurantChange}
                    isLoading={isLoadingRestaurants}
                />
            </div>

            {/* Main Content */}
            {selectedRestaurantId && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-2" style={{ borderColor: vendorColors.primary[200] }}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng số</p>
                                        <p className="text-2xl font-bold" style={{ color: vendorColors.primary[700] }}>
                                            {statusCounts.all}
                                        </p>
                                    </div>
                                    <Utensils className="h-8 w-8" style={{ color: vendorColors.primary[300] }} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-yellow-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Chờ duyệt</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {statusCounts.pending}
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-300" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Đã duyệt</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {statusCounts.approved}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-300" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Bị từ chối</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {statusCounts.rejected}
                                        </p>
                                    </div>
                                    <XCircle className="h-8 w-8 text-red-300" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Tabs */}
                    <Card className="border-2" style={{ borderColor: vendorColors.primary[200] }}>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Tìm kiếm món ăn..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Sort */}
                                <div className="flex gap-2">
                                    <Select
                                        value={sortBy}
                                        onValueChange={(value: 'name' | 'price' | 'createdAt') => setSortBy(value)}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Sắp xếp" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">Tên</SelectItem>
                                            <SelectItem value="price">Giá</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={sortDirection}
                                        onValueChange={(value: 'asc' | 'desc') => setSortDirection(value)}
                                    >
                                        <SelectTrigger className="w-28">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Tăng dần</SelectItem>
                                            <SelectItem value="desc">Giảm dần</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="all" className="gap-2">
                                Tất cả
                                <Badge variant="secondary" className="ml-1">{statusCounts.all}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="gap-2">
                                Chờ duyệt
                                <Badge className="ml-1 bg-yellow-100 text-yellow-800">{statusCounts.pending}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="approved" className="gap-2">
                                Đã duyệt
                                <Badge className="ml-1 bg-green-100 text-green-800">{statusCounts.approved}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="rejected" className="gap-2">
                                Từ chối
                                <Badge className="ml-1 bg-red-100 text-red-800">{statusCounts.rejected}</Badge>
                            </TabsTrigger>
                        </TabsList>

                        {/* Dishes Grid */}
                        <TabsContent value={activeTab} className="mt-0">
                            {isLoadingDishes ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: vendorColors.primary[600] }} />
                                </div>
                            ) : filteredDishes.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <Utensils className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-600">
                                            {searchQuery ? 'Không tìm thấy món ăn' : 'Chưa có món ăn nào'}
                                        </h3>
                                        <p className="text-gray-500 mt-1">
                                            {searchQuery
                                                ? 'Thử tìm kiếm với từ khóa khác'
                                                : 'Bắt đầu thêm món ăn cho quán của bạn'}
                                        </p>
                                        {!searchQuery && (
                                            <Button
                                                className="mt-4 text-white"
                                                style={{ background: vendorColors.gradients.primarySoft }}
                                                onClick={handleCreateDish}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Thêm món mới
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {filteredDishes.map((dish) => (
                                            <DishCard
                                                key={dish.dishId}
                                                dish={dish}
                                                onView={handleViewDish}
                                                onEdit={handleEditDish}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-sm text-gray-600">
                                                Hiển thị {filteredDishes.length} / {totalElements} món ăn
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPage(Math.max(0, page - 1))}
                                                    disabled={page === 0 || isFetching}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm">
                                                    Trang {page + 1} / {totalPages}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                                    disabled={page >= totalPages - 1 || isFetching}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </>
            )}

            {/* Modals */}
            {selectedRestaurantId && (
                <>
                    <VendorDishFormModal
                        dish={selectedDish}
                        restaurantId={selectedRestaurantId}
                        restaurantName={selectedRestaurant?.name}
                        open={formModalOpen}
                        onOpenChange={setFormModalOpen}
                        onSuccess={handleSuccess}
                    />
                    <VendorDishDetailModal
                        dish={selectedDish}
                        restaurantName={selectedRestaurant?.name}
                        open={detailModalOpen}
                        onOpenChange={setDetailModalOpen}
                        onEdit={handleEditDish}
                    />
                </>
            )}
        </div>
    )
}
