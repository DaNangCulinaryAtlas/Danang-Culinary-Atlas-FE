"use client"

import { useState } from "react"
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
import { Check, X, MapPin, Clock, FileText, Eye, ArrowLeft, Store, User, Search } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock data for location filters
const provinces = [
  { id: 1, name: "Đà Nẵng" },
  { id: 2, name: "Hà Nội" },
  { id: 3, name: "Hồ Chí Minh" },
]

const districts = [
  { id: 1, name: "Quận 1", provinceId: 1 },
  { id: 2, name: "Quận 2", provinceId: 1 },
  { id: 3, name: "Quận 3", provinceId: 1 },
  { id: 4, name: "Hải Châu", provinceId: 1 },
  { id: 5, name: "Thanh Khê", provinceId: 1 },
]

const wards = [
  { id: 1, name: "Phường 1", districtId: 1 },
  { id: 2, name: "Phường 2", districtId: 1 },
  { id: 3, name: "Phường 3", districtId: 2 },
  { id: 4, name: "Phường 4", districtId: 2 },
]

// Mock data
const pendingRestaurants = [
  {
    id: 1,
    name: "Quán Bún Bò Huế",
    address: "123 Đường ABC, Phường 1, Quận 1, Đà Nẵng",
    vendor: "Vendor A",
    submittedDate: "2024-03-15",
    status: "Pending",
    province: "Đà Nẵng",
    district: "Quận 1",
    ward: "Phường 1",
  },
  {
    id: 2,
    name: "Nhà hàng Hải Sản",
    address: "456 Đường XYZ, Phường 2, Quận 1, Đà Nẵng",
    vendor: "Vendor B",
    submittedDate: "2024-03-14",
    status: "Pending",
    province: "Đà Nẵng",
    district: "Quận 1",
    ward: "Phường 2",
  },
  {
    id: 9,
    name: "Quán Cơm Gà",
    address: "789 Đường DEF, Phường 3, Quận 2, Đà Nẵng",
    vendor: "Vendor C",
    submittedDate: "2024-03-13",
    status: "Pending",
    province: "Đà Nẵng",
    district: "Quận 2",
    ward: "Phường 3",
  },
]

// All active restaurants (for "Xem tất cả quán ăn" view)
const allActiveRestaurants = [
  {
    id: 3,
    name: "Cafe Sáng",
    address: "789 Đường DEF, Phường 1, Quận 3, Đà Nẵng",
    vendor: "Nguyễn Văn A",
    approvedDate: "2024-03-10",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 3",
    ward: "Phường 1",
  },
  {
    id: 4,
    name: "Quán Phở Bò",
    address: "321 Đường GHI, Phường 2, Quận 1, Đà Nẵng",
    vendor: "Nguyễn Văn A",
    approvedDate: "2024-02-15",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 1",
    ward: "Phường 2",
  },
  {
    id: 5,
    name: "Nhà hàng Hải Sản Biển",
    address: "654 Đường JKL, Phường 3, Quận 2, Đà Nẵng",
    vendor: "Nguyễn Văn A",
    approvedDate: "2024-01-20",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 2",
    ward: "Phường 3",
  },
  {
    id: 6,
    name: "Quán Bánh Mì",
    address: "987 Đường MNO, Phường 4, Quận 4, Đà Nẵng",
    vendor: "Trần Thị B",
    approvedDate: "2024-03-05",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 4",
    ward: "Phường 4",
  },
  {
    id: 7,
    name: "Cafe Chiều",
    address: "147 Đường PQR, Phường 1, Quận 5, Đà Nẵng",
    vendor: "Trần Thị B",
    approvedDate: "2024-02-28",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 5",
    ward: "Phường 1",
  },
  {
    id: 8,
    name: "Quán Chè",
    address: "258 Đường STU, Phường 2, Quận 6, Đà Nẵng",
    vendor: "Lê Văn C",
    approvedDate: "2024-03-12",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 6",
    ward: "Phường 2",
  },
]

// Mock vendors with their restaurants
const vendors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    totalRestaurants: 3,
    restaurants: [
      {
        id: 3,
        name: "Cafe Sáng",
        address: "789 Đường DEF, Quận 3, Đà Nẵng",
        approvedDate: "2024-03-10",
        status: "Active",
        image: null,
      },
      {
        id: 4,
        name: "Quán Phở Bò",
        address: "321 Đường GHI, Quận 1, Đà Nẵng",
        approvedDate: "2024-02-15",
        status: "Active",
        image: null,
      },
      {
        id: 5,
        name: "Nhà hàng Hải Sản Biển",
        address: "654 Đường JKL, Quận 2, Đà Nẵng",
        approvedDate: "2024-01-20",
        status: "Active",
        image: null,
      },
    ],
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0907654321",
    totalRestaurants: 2,
    restaurants: [
      {
        id: 6,
        name: "Quán Bánh Mì",
        address: "987 Đường MNO, Quận 4, Đà Nẵng",
        approvedDate: "2024-03-05",
        status: "Active",
        image: null,
      },
      {
        id: 7,
        name: "Cafe Chiều",
        address: "147 Đường PQR, Quận 5, Đà Nẵng",
        approvedDate: "2024-02-28",
        status: "Active",
        image: null,
      },
    ],
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0909876543",
    totalRestaurants: 1,
    restaurants: [
      {
        id: 8,
        name: "Quán Chè",
        address: "258 Đường STU, Quận 6, Đà Nẵng",
        approvedDate: "2024-03-12",
        status: "Active",
        image: null,
      },
    ],
  },
]

export default function RestaurantApproval() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null)
  const [viewMode, setViewMode] = useState<"vendors" | "restaurants">("vendors")
  
  // Search and filter states for pending restaurants
  const [pendingSearch, setPendingSearch] = useState("")
  const [pendingProvince, setPendingProvince] = useState("all")
  const [pendingDistrict, setPendingDistrict] = useState("all")
  const [pendingWard, setPendingWard] = useState("all")
  
  // Search and filter states for active restaurants
  const [activeViewType, setActiveViewType] = useState<"all" | "vendor">("vendor")
  const [activeSearch, setActiveSearch] = useState("")
  
  // Filter pending restaurants
  const filteredPendingRestaurants = pendingRestaurants.filter((restaurant) => {
    const matchesSearch = !pendingSearch || 
      restaurant.name.toLowerCase().includes(pendingSearch.toLowerCase())
    const matchesProvince = pendingProvince === "all" || restaurant.province === pendingProvince
    const matchesDistrict = pendingDistrict === "all" || restaurant.district === pendingDistrict
    const matchesWard = pendingWard === "all" || restaurant.ward === pendingWard
    
    return matchesSearch && matchesProvince && matchesDistrict && matchesWard
  })
  
  // Filter active restaurants (for "all" view)
  const filteredActiveRestaurants = allActiveRestaurants.filter((restaurant) => {
    return !activeSearch || restaurant.name.toLowerCase().includes(activeSearch.toLowerCase())
  })
  
  // Get districts based on selected province
  const availableDistricts = pendingProvince === "all" 
    ? districts 
    : districts.filter(d => d.provinceId === provinces.find(p => p.name === pendingProvince)?.id)
  
  // Get wards based on selected district
  const availableWards = pendingDistrict === "all"
    ? wards
    : wards.filter(w => w.districtId === districts.find(d => d.name === pendingDistrict)?.id)

  const handleApprove = (id: number) => {
    // TODO: API call to approve restaurant
    console.log("Approve restaurant:", id)
  }

  const handleReject = () => {
    if (selectedRestaurant && rejectionReason) {
      // TODO: API call to reject restaurant with reason
      console.log("Reject restaurant:", selectedRestaurant, rejectionReason)
      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedRestaurant(null)
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
            Chờ duyệt <Badge variant="destructive" className="ml-2">2</Badge>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                      Tỉnh/Thành phố
                    </Label>
                    <Select value={pendingProvince} onValueChange={(value) => {
                      setPendingProvince(value)
                      setPendingDistrict("all")
                      setPendingWard("all")
                    }}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                      Quận/Huyện
                    </Label>
                    <Select 
                      value={pendingDistrict} 
                      onValueChange={(value) => {
                        setPendingDistrict(value)
                        setPendingWard("all")
                      }}
                      disabled={pendingProvince === "all"}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {availableDistricts.map((district) => (
                          <SelectItem key={district.id} value={district.name}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                      Xã/Phường
                    </Label>
                    <Select 
                      value={pendingWard} 
                      onValueChange={setPendingWard}
                      disabled={pendingDistrict === "all"}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn xã/phường" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {availableWards.map((ward) => (
                          <SelectItem key={ward.id} value={ward.name}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên quán</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Ngày gửi</TableHead>
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
                      <TableCell>{restaurant.vendor}</TableCell>
                      <TableCell>{restaurant.submittedDate}</TableCell>
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
                                        08:00 - 22:00
                                      </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 mt-0.5" />
                                      <span>
                                        <span className="font-medium">Mô tả:</span>{" "}
                                        Quán ăn chuyên về bún bò Huế truyền thống
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Bản đồ</h3>
                                  <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    [Mini map - Hiển thị vị trí dựa trên kinh độ/vĩ độ]
                                  </div>
                                </div>
                              </div>

                              {/* Right Column - Images & License */}
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
                                  setSelectedRestaurant(restaurant.id)
                                  setShowRejectDialog(true)
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Từ chối
                              </Button>
                              <Button
                                onClick={() => handleApprove(restaurant.id)}
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
              {/* Search for all restaurants */}
              <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4 md:p-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo tên quán ăn..."
                      value={activeSearch}
                      onChange={(e) => setActiveSearch(e.target.value)}
                      className="pl-9 h-9"
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
                  {filteredActiveRestaurants.length === 0 ? (
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
                                <p className="text-xs font-semibold text-gray-500">Vendor:</p>
                                <p className="text-sm font-medium">{restaurant.vendor}</p>
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
                                      <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                        [Mini map - Hiển thị vị trí dựa trên kinh độ/vĩ độ]
                                      </div>
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
                  Tổng số: {vendors.length} vendor đang hoạt động
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vendors.map((vendor) => (
                    <Card
                      key={vendor.id}
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
                              ringColor: adminColors.primary[200]
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
                              {vendor.totalRestaurants}
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
                    {selectedVendor?.name} - Tổng số: {selectedVendor?.totalRestaurants} quán
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
                              <p className="text-xs font-semibold text-gray-500">Ngày duyệt:</p>
                              <p className="text-sm font-medium">{restaurant.approvedDate}</p>
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
                                    <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                      [Mini map - Hiển thị vị trí dựa trên kinh độ/vĩ độ]
                                    </div>
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

