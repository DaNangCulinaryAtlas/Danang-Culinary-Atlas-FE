"use client"

import { useEffect, useMemo, useState, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminColors } from "@/configs/colors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, MapPin, Clock, FileText, Eye, ArrowLeft, Store, User, Search, Loader2 } from "lucide-react"
import Image from "next/image"
import { API_ENDPOINTS, BASE_URL } from "@/configs/api"
import { useRestaurants } from "./hooks/useRestaurants"
import { useLocations } from "./hooks/useLocations"
import { useVendors } from "./hooks/useVendors"
import { filterRestaurantsByLocation, groupRestaurantsByVendor } from "./utils/restaurantUtils"
import MiniMap from "./components/MiniMap"
import LocationFilter from "./components/LocationFilter"
import type { Restaurant, VendorGroup } from "./types"
import { toast } from "react-toastify"


export default function RestaurantApproval() {
  // Custom hooks
  const { restaurants, isLoading, error, refetch: refetchRestaurants } = useRestaurants()
  const { vendorsById } = useVendors()
  const { provinces, districts, wards, fetchDistricts, fetchWards } = useLocations()

  // UI state
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<VendorGroup | null>(null)
  const [viewMode, setViewMode] = useState<"vendors" | "restaurants">("vendors")
  
  // Search and filter states for pending restaurants
  const [pendingSearch, setPendingSearch] = useState("")
  const [pendingProvinceId, setPendingProvinceId] = useState<number | null>(null)
  const [pendingDistrictId, setPendingDistrictId] = useState<number | null>(null)
  const [pendingWardId, setPendingWardId] = useState<number | null>(null)
  
  // Search and filter states for active restaurants
  const [activeViewType, setActiveViewType] = useState<"all" | "vendor">("vendor")
  const [activeSearch, setActiveSearch] = useState("")
  const [activeProvinceId, setActiveProvinceId] = useState<number | null>(null)
  const [activeDistrictId, setActiveDistrictId] = useState<number | null>(null)
  const [activeWardId, setActiveWardId] = useState<number | null>(null)
  
  // Restaurants từ API: chia pending / active theo approvalStatus & status
  const pendingFromApi = useMemo(
    () => restaurants.filter((r) => (r.approvalStatus || "").toUpperCase() === "PENDING"),
    [restaurants]
  )

  const activeFromApi = useMemo(
    () =>
      restaurants.filter(
        (r) =>
          (r.approvalStatus || "").toUpperCase() === "APPROVED" &&
          (r.status || "").toUpperCase() === "ACTIVE"
      ),
    [restaurants]
  )

  // Filter pending restaurants (search theo tên + location)
  const filteredPendingRestaurants = useMemo(() => {
    let filtered = filterRestaurantsByLocation(
      pendingFromApi,
      pendingProvinceId,
      pendingDistrictId,
      pendingWardId,
      districts,
      wards
    )
    
    // Filter by search query
    if (pendingSearch) {
      const lowerSearch = pendingSearch.toLowerCase()
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(lowerSearch))
    }
    
    return filtered
  }, [pendingFromApi, pendingSearch, pendingProvinceId, pendingDistrictId, pendingWardId, districts, wards])

  // Filter active restaurants (for "all" view)
  const filteredActiveRestaurants = useMemo(() => {
    let filtered = filterRestaurantsByLocation(
      activeFromApi,
      activeProvinceId,
      activeDistrictId,
      activeWardId,
      districts,
      wards
    )
    
    // Filter by search query
    if (activeSearch) {
      const lowerSearch = activeSearch.toLowerCase()
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(lowerSearch))
    }
    
    return filtered
  }, [activeFromApi, activeSearch, activeProvinceId, activeDistrictId, activeWardId, districts, wards])

  // Group theo vendor từ danh sách active (xem theo Vendor)
  const vendorGroups: VendorGroup[] = useMemo(
    () => groupRestaurantsByVendor(activeFromApi, vendorsById),
    [activeFromApi, vendorsById]
  )

  // Fetch districts/wards when location filters change

  // Fetch districts when province is selected (pending)
  useEffect(() => {
    if (pendingProvinceId !== null) {
      fetchDistricts(pendingProvinceId)
      setPendingDistrictId(null)
      setPendingWardId(null)
    }
  }, [pendingProvinceId, fetchDistricts])

  // Fetch wards when district is selected (pending)
  useEffect(() => {
    if (pendingDistrictId !== null) {
      fetchWards(pendingDistrictId)
      setPendingWardId(null)
    }
  }, [pendingDistrictId, fetchWards])

  // Fetch districts when province is selected (active)
  useEffect(() => {
    if (activeProvinceId !== null) {
      fetchDistricts(activeProvinceId)
      setActiveDistrictId(null)
      setActiveWardId(null)
    }
  }, [activeProvinceId, fetchDistricts])

  // Fetch wards when district is selected (active)
  useEffect(() => {
    if (activeDistrictId !== null) {
      fetchWards(activeDistrictId)
      setActiveWardId(null)
    }
  }, [activeDistrictId, fetchWards])

  const handleApprove = async (restaurant: Restaurant) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const body = {
        status: "APPROVED",
        rejectionReason: null,
      }

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANT_APPROVE(restaurant.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error("Không thể duyệt quán ăn")
      }

      await refetchRestaurants()
    } catch (error) {
      toast.error('Không thể duyệt quán ăn. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 2500,
      });
    }
  }

  const handleReject = async () => {
    if (!selectedRestaurant || !rejectionReason.trim()) {
      return
    }

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const body = {
        status: "REJECTED",
        rejectionReason,
      }

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANT_APPROVE(selectedRestaurant.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error("Không thể từ chối quán ăn")
      }

      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedRestaurant(null)
      await refetchRestaurants()
    } catch (error) {
      toast.error('Không thể từ chối quán ăn. Vui lòng thử lại.', {
        position: 'top-right',
        autoClose: 2500,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-5 md:p-6 text-white shadow-lg"
        style={{ background: adminColors.gradients.primary }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Quán ăn</h1>
        <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
          Kiểm duyệt và quản lý quán ăn trong hệ thống
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ duyệt{" "}
            <Badge variant="destructive" className="ml-2">
              {pendingFromApi.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Search and Filter Card */}
          <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
            <CardContent className="p-4 md:p-5">
              <div className="space-y-3">
                {/* Search by restaurant name */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo tên quán ăn..."
                      value={pendingSearch}
                      onChange={(e) => setPendingSearch(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                
                {/* Location Filters */}
                <LocationFilter
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  provinceId={pendingProvinceId}
                  districtId={pendingDistrictId}
                  wardId={pendingWardId}
                  onProvinceChange={(id) => {
                    setPendingProvinceId(id)
                    setPendingDistrictId(null)
                    setPendingWardId(null)
                  }}
                  onDistrictChange={(id) => {
                    setPendingDistrictId(id)
                    setPendingWardId(null)
                  }}
                  onWardChange={setPendingWardId}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pending Restaurants Table */}
          <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
            <CardHeader 
              className="text-white"
              style={{ background: adminColors.gradients.primary }}
            >
              <CardTitle className="text-white text-xl font-bold">Danh sách chờ duyệt</CardTitle>
              <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                Tổng số: {filteredPendingRestaurants.length} quán ăn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang tải danh sách quán ăn...
                </div>
              ) : error ? (
                <div className="py-8 text-center text-sm text-red-600">{error}</div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên quán</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingRestaurants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy quán ăn nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>{restaurant.id}</TableCell>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{restaurant.approvalStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        {restaurant.createdAt
                          ? new Date(restaurant.createdAt).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Chi tiết Duyệt Quán</DialogTitle>
                              <DialogDescription>
                                {restaurant.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left Column - Restaurant Info */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Thông tin quán</h3>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="font-medium">Tên quán:</span>{" "}
                                      {restaurant.name}
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 mt-0.5" />
                                      <span>
                                        <span className="font-medium">Địa chỉ:</span>{" "}
                                        {restaurant.address}
                                      </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Clock className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Giờ mở cửa:</span>{" "}
                                          Chưa có thông tin
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Mô tả:</span>{" "}
                                          Thông tin mô tả đang được cập nhật
                                        </span>
                                    </div>
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

                              {/* Right Column - Images & License */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Hình ảnh quán ăn</h3>
                                  <div className="space-y-3">
                                    <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
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
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Giấy phép kinh doanh
                                  </h3>
                                  <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    [Ảnh scan từ bảng Business_License]
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedRestaurant(restaurant)
                                  setShowRejectDialog(true)
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Từ chối
                              </Button>
                              <Button
                                onClick={() => handleApprove(restaurant)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Chấp thuận
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* View Type Toggle */}
          <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
            <CardContent className="p-4 md:p-5">
              <div className="flex gap-3">
                <Button
                  variant={activeViewType === "all" ? "default" : "outline"}
                  onClick={() => {
                    setActiveViewType("all")
                    setViewMode("restaurants")
                    setSelectedVendor(null)
                  }}
                  className="flex-1 font-semibold"
                  style={activeViewType === "all" ? {
                    background: adminColors.gradients.primarySoft,
                    color: 'white'
                  } : {}}
                >
                  Xem tất cả quán ăn
                </Button>
                <Button
                  variant={activeViewType === "vendor" ? "default" : "outline"}
                  onClick={() => {
                    setActiveViewType("vendor")
                    setViewMode("vendors")
                    setSelectedVendor(null)
                  }}
                  className="flex-1 font-semibold"
                  style={activeViewType === "vendor" ? {
                    background: adminColors.gradients.primarySoft,
                    color: 'white'
                  } : {}}
                >
                  Xem theo Vendor
                </Button>
              </div>
            </CardContent>
          </Card>

          {activeViewType === "all" ? (
            <div className="space-y-4">
              {/* Search and Filter Card for active restaurants */}
              <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4 md:p-5">
                  <div className="space-y-3">
                    {/* Search by restaurant name */}
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Tìm kiếm theo tên quán ăn..."
                          value={activeSearch}
                          onChange={(e) => setActiveSearch(e.target.value)}
                          className="pl-9 h-9"
                        />
                      </div>
                    </div>
                    
                    {/* Location Filters */}
                    <LocationFilter
                      provinces={provinces}
                      districts={districts}
                      wards={wards}
                      provinceId={activeProvinceId}
                      districtId={activeDistrictId}
                      wardId={activeWardId}
                      onProvinceChange={(id) => {
                        setActiveProvinceId(id)
                        setActiveDistrictId(null)
                        setActiveWardId(null)
                      }}
                      onDistrictChange={(id) => {
                        setActiveDistrictId(id)
                        setActiveWardId(null)
                      }}
                      onWardChange={setActiveWardId}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* All Restaurants Grid */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">
                    Tất cả Quán ăn đang hoạt động
                  </CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    Tổng số: {filteredActiveRestaurants.length} quán
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
                  ) : filteredActiveRestaurants.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Không tìm thấy quán ăn nào
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredActiveRestaurants.map((restaurant) => (
                        <Card
                          key={restaurant.id}
                          className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white group"
                          style={{ borderColor: adminColors.primary[200] }}
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
                            <CardTitle className="text-lg font-bold truncate" style={{ color: adminColors.primary[700] }}>
                        {restaurant.name}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-2">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {restaurant.address}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500">Trạng thái:</p>
                                <p className="text-sm font-medium">{restaurant.status}</p>
                              </div>
                              <Badge variant="approved">Hoạt động</Badge>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="w-full font-semibold"
                                  style={{
                                    background: adminColors.gradients.primarySoft,
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
                                  <DialogDescription>
                                    {restaurant.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Left Column - Restaurant Info */}
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Thông tin quán</h3>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="font-medium">Tên quán:</span>{" "}
                                          {restaurant.name}
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <MapPin className="h-4 w-4 mt-0.5" />
                                          <span>
                                            <span className="font-medium">Địa chỉ:</span>{" "}
                                            {restaurant.address}
                                          </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Clock className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Giờ mở cửa:</span>{" "}
                                          Chưa có thông tin
                                        </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <FileText className="h-4 w-4 mt-0.5" />
                                          <span>
                                          <span className="font-medium">Mô tả:</span>{" "}
                                          Thông tin mô tả đang được cập nhật
                                        </span>
                                        </div>
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
                                        <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : viewMode === "vendors" ? (
            <Card className="border-2 shadow-xl bg-white" style={{ borderColor: adminColors.primary[200] }}>
              <CardHeader 
                className="text-white"
                style={{ background: adminColors.gradients.primary }}
              >
                <CardTitle className="text-white text-xl font-bold">Danh sách Vendor</CardTitle>
                <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                  Tổng số: {vendorGroups.length} vendor đang hoạt động
                </CardDescription>
              </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vendorGroups.map((vendor) => (
                    <Card
                      key={vendor.ownerAccountId}
                      className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-white"
                      style={{ borderColor: adminColors.primary[200] }}
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setViewMode("restaurants")
                      }}
                    >
                      <CardHeader 
                        className="pb-3"
                        style={{ 
                          background: `linear-gradient(135deg, ${adminColors.primary[50]}, rgba(230, 244, 248, 0.3))`,
                          borderBottom: `2px solid ${adminColors.primary[200]}`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ring-2 transition-transform group-hover:scale-110"
                            style={{ 
                              background: adminColors.gradients.primarySoft,
                              ["--tw-ring-color" as string]: adminColors.primary[200],
                            }}
                          >
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-bold truncate" style={{ color: adminColors.primary[700] }}>
                              {vendor.name}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium truncate">
                              {vendor.email}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Số điện thoại:</span>
                            <span className="text-sm font-medium">{vendor.phone}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: adminColors.primary[100] }}>
                            <div className="flex items-center gap-2">
                              <Store className="h-4 w-4" style={{ color: adminColors.accent.emerald }} />
                              <span className="text-sm font-semibold text-gray-600">Số quán:</span>
                            </div>
                            <Badge 
                              className="font-bold px-3 py-1"
                              style={{ 
                                background: adminColors.gradients.primarySoft,
                                color: 'white'
                              }}
                            >
                              {vendor.restaurants.length}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 font-semibold"
                          style={{
                            background: adminColors.gradients.primarySoft,
                            color: 'white'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedVendor(vendor)
                            setViewMode("restaurants")
                          }}
                        >
                          Xem danh sách quán ăn
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Breadcrumb/Back Button */}
              <Card className="border-2 shadow-lg bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setViewMode("vendors")
                      setSelectedVendor(null)
                    }}
                    className="gap-2 font-semibold"
                    style={{ color: adminColors.primary[600] }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại danh sách Vendor
                  </Button>
                  {selectedVendor && (
                    <div className="mt-4 p-4 rounded-xl" style={{ background: adminColors.primary[50] }}>
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ background: adminColors.gradients.primarySoft }}
                        >
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: adminColors.primary[700] }}>
                            {selectedVendor.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-600">{selectedVendor.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Restaurants List */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">
                    Danh sách Quán ăn
                  </CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    {selectedVendor?.name} - Tổng số: {selectedVendor?.restaurants.length ?? 0} quán
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {selectedVendor?.restaurants.map((restaurant) => (
                      <Card
                        key={restaurant.id}
                        className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white group"
                        style={{ borderColor: adminColors.primary[200] }}
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
                          <CardTitle className="text-lg font-bold truncate" style={{ color: adminColors.primary[700] }}>
                            {restaurant.name}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {restaurant.address}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500">Ngày tạo:</p>
                                <p className="text-sm font-medium">
                                  {restaurant.createdAt
                                    ? new Date(restaurant.createdAt).toLocaleString()
                                    : "-"}
                                </p>
                              </div>
                              <Badge variant="approved">{restaurant.status}</Badge>
                            </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full font-semibold"
                                style={{
                                  background: adminColors.gradients.primarySoft,
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
                                <DialogDescription>
                                  {restaurant.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Restaurant Info */}
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold mb-2">Thông tin quán</h3>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span className="font-medium">Tên quán:</span>{" "}
                                        {restaurant.name}
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Địa chỉ:</span>{" "}
                                          {restaurant.address}
                                        </span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Giờ mở cửa:</span>{" "}
                                          08:00 - 22:00
                                        </span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Mô tả:</span>{" "}
                                          Quán ăn đang hoạt động tốt
                                        </span>
                                      </div>
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
                                    <div className="grid grid-cols-2 gap-2">
                                      {[1, 2, 3, 4].map((i) => (
                                        <div
                                          key={i}
                                          className="h-32 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
                                        >
                                          Hình {i}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
            </CardContent>
          </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối Quán ăn</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối (rejection_reason)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setRejectionReason("")
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

