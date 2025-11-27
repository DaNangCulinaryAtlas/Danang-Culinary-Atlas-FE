"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { adminColors } from "@/configs/colors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Check, X, Eye, EyeOff, Store, Utensils, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - Pending dishes
const pendingDishes = [
  {
    id: 1,
    name: "Bún Bò Huế",
    price: 45000,
    restaurant: "Quán Bún Bò Huế",
    restaurantId: 1,
    image: null,
    tags: ["Cay", "Mặn"],
    status: "Pending",
    description: "Món bún bò Huế đặc sản với hương vị đậm đà",
  },
  {
    id: 2,
    name: "Cơm Gà",
    price: 55000,
    restaurant: "Quán Cơm Gà",
    restaurantId: 4,
    image: null,
    tags: ["Mặn"],
    status: "Pending",
    description: "Cơm gà thơm ngon, đậm đà",
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng",
    price: 30000,
    restaurant: "Quán Bánh Mì",
    restaurantId: 5,
    image: null,
    tags: ["Mặn"],
    status: "Pending",
    description: "Bánh mì thịt nướng giòn tan",
  },
]

// Mock data - Restaurants with pending dishes
const restaurantsWithPendingDishes = [
  {
    id: 1,
    name: "Quán Bún Bò Huế",
    address: "123 Đường ABC, Quận 1, Đà Nẵng",
    pendingCount: 1,
    dishes: [
      {
        id: 1,
        name: "Bún Bò Huế",
        price: 45000,
        image: null,
        tags: ["Cay", "Mặn"],
        status: "Pending",
        description: "Món bún bò Huế đặc sản với hương vị đậm đà",
      },
    ],
  },
  {
    id: 4,
    name: "Quán Cơm Gà",
    address: "456 Đường XYZ, Quận 2, Đà Nẵng",
    pendingCount: 1,
    dishes: [
      {
        id: 2,
    name: "Cơm Gà",
        price: 55000,
        image: null,
        tags: ["Mặn"],
        status: "Pending",
        description: "Cơm gà thơm ngon, đậm đà",
      },
    ],
  },
  {
    id: 5,
    name: "Quán Bánh Mì",
    address: "789 Đường DEF, Quận 3, Đà Nẵng",
    pendingCount: 1,
    dishes: [
      {
        id: 3,
        name: "Bánh Mì Thịt Nướng",
        price: 30000,
    image: null,
    tags: ["Mặn"],
    status: "Pending",
        description: "Bánh mì thịt nướng giòn tan",
      },
    ],
  },
]

// Mock data - All restaurants with their dishes
const allRestaurants = [
  {
    id: 1,
    name: "Quán Bún Bò Huế",
    address: "123 Đường ABC, Quận 1, Đà Nẵng",
    dishes: [
      {
        id: 1,
        name: "Bún Bò Huế",
        price: 45000,
        image: null,
        tags: ["Cay", "Mặn"],
        isVisible: true,
        description: "Món bún bò Huế đặc sản với hương vị đậm đà",
      },
      {
        id: 4,
        name: "Bún Riêu",
        price: 40000,
        image: null,
        tags: ["Mặn"],
        isVisible: true,
        description: "Bún riêu cua thơm ngon",
      },
    ],
  },
  {
    id: 2,
    name: "Nhà hàng Phở",
    address: "456 Đường XYZ, Quận 2, Đà Nẵng",
    dishes: [
      {
        id: 5,
        name: "Phở Bò",
        price: 50000,
        image: null,
        tags: ["Mặn"],
        isVisible: true,
        description: "Phở bò truyền thống",
      },
      {
        id: 6,
        name: "Phở Gà",
        price: 45000,
        image: null,
        tags: ["Mặn"],
        isVisible: false,
        description: "Phở gà thơm ngon",
      },
    ],
  },
  {
    id: 3,
    name: "Quán Chay",
    address: "789 Đường DEF, Quận 3, Đà Nẵng",
    dishes: [
      {
        id: 7,
        name: "Bánh Mì Chay",
        price: 25000,
        image: null,
        tags: ["Chay"],
        isVisible: true,
        description: "Bánh mì chay thanh đạm",
      },
    ],
  },
]

export default function DishManagement() {
  const [selectedDishes, setSelectedDishes] = useState<number[]>([])
  const [selectedDishesByRestaurant, setSelectedDishesByRestaurant] = useState<Record<number, number[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [approvalViewMode, setApprovalViewMode] = useState<"all" | "restaurants">("all")
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof allRestaurants[0] | null>(null)
  const [hiddenDishes, setHiddenDishes] = useState<Set<number>>(new Set())
  const [expandedRestaurants, setExpandedRestaurants] = useState<Set<number>>(new Set())

  const toggleDishSelection = (id: number) => {
    setSelectedDishes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const handleBulkApprove = () => {
    // TODO: API call to approve multiple dishes
    console.log("Approve dishes:", selectedDishes)
    setSelectedDishes([])
  }

  const toggleDishSelectionByRestaurant = (restaurantId: number, dishId: number) => {
    setSelectedDishesByRestaurant((prev) => {
      const current = prev[restaurantId] || []
      const newSelection = current.includes(dishId)
        ? current.filter((id) => id !== dishId)
        : [...current, dishId]
      return { ...prev, [restaurantId]: newSelection }
    })
  }

  const handleBulkApproveByRestaurant = (restaurantId: number) => {
    const dishIds = selectedDishesByRestaurant[restaurantId] || []
    // TODO: API call to approve multiple dishes
    console.log("Approve dishes for restaurant:", restaurantId, dishIds)
    setSelectedDishesByRestaurant((prev) => {
      const newState = { ...prev }
      delete newState[restaurantId]
      return newState
    })
  }

  const toggleRestaurantExpansion = (restaurantId: number) => {
    setExpandedRestaurants((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(restaurantId)) {
        newSet.delete(restaurantId)
      } else {
        newSet.add(restaurantId)
      }
      return newSet
    })
  }

  const handleApprove = (id: number) => {
    // TODO: API call to approve dish
    console.log("Approve dish:", id)
  }

  const handleReject = (id: number) => {
    // TODO: API call to reject dish
    console.log("Reject dish:", id)
  }

  const toggleDishVisibility = (dishId: number) => {
    const newHidden = new Set(hiddenDishes)
    if (newHidden.has(dishId)) {
      newHidden.delete(dishId)
    } else {
      newHidden.add(dishId)
    }
    setHiddenDishes(newHidden)
  }

  // Filter pending dishes
  const filteredPendingDishes = pendingDishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter restaurants with pending dishes
  const filteredRestaurantsWithPending = restaurantsWithPendingDishes.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.dishes.some((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Filter all restaurants
  const filteredAllRestaurants = allRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div 
        className="rounded-xl p-5 md:p-6 text-white shadow-lg"
        style={{ background: adminColors.gradients.primary }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Món ăn</h1>
        <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
          Kiểm duyệt và quản lý món ăn trong hệ thống
        </p>
      </div>

      <Tabs defaultValue="approval" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approval">
            Duyệt món ăn <Badge variant="destructive" className="ml-2">{pendingDishes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="restaurants">Danh sách nhà hàng</TabsTrigger>
        </TabsList>

        {/* Tab 1: Duyệt món ăn */}
        <TabsContent value="approval" className="space-y-4">
          {/* View Mode Toggle */}
          <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
            <CardContent className="p-4 md:p-5">
              <div className="flex gap-3">
                <Button
                  variant={approvalViewMode === "all" ? "default" : "outline"}
                  onClick={() => setApprovalViewMode("all")}
                  className="flex-1 font-semibold"
                  style={approvalViewMode === "all" ? {
                    background: adminColors.gradients.primarySoft,
                    color: 'white'
                  } : {}}
                >
                  Tất cả món chờ duyệt
                </Button>
                <Button
                  variant={approvalViewMode === "restaurants" ? "default" : "outline"}
                  onClick={() => setApprovalViewMode("restaurants")}
                  className="flex-1 font-semibold"
                  style={approvalViewMode === "restaurants" ? {
                    background: adminColors.gradients.primarySoft,
                    color: 'white'
                  } : {}}
                >
                  Theo nhà hàng
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
            <CardContent className="p-4 md:p-5">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                  placeholder="Tìm kiếm món ăn hoặc nhà hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
              />
            </div>
            </CardContent>
          </Card>

          {approvalViewMode === "all" ? (
            <>
              {/* Bulk Actions */}
            {selectedDishes.length > 0 && (
                <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Đã chọn: {selectedDishes.length} món
                      </span>
                      <Button
                        onClick={handleBulkApprove}
                        className="font-semibold"
                        style={{
                          background: adminColors.status.success,
                          color: 'white'
                        }}
                      >
                <Check className="mr-2 h-4 w-4" />
                        Duyệt nhanh
              </Button>
          </div>
        </CardContent>
      </Card>
              )}

              {/* All Pending Dishes Grid */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">Tất cả món chờ duyệt</CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    Tổng số: {filteredPendingDishes.length} món
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {filteredPendingDishes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Không tìm thấy món ăn nào
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {filteredPendingDishes.map((dish) => (
                        <Card
                          key={dish.id}
                          className="border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-white overflow-hidden"
                          style={{ borderColor: adminColors.primary[200] }}
                        >
                          <div className="relative aspect-square bg-muted">
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                                <Utensils className="h-8 w-8" />
                </div>
              )}
                            <div className="absolute top-1.5 right-1.5">
                <Checkbox
                  checked={selectedDishes.includes(dish.id)}
                  onCheckedChange={() => toggleDishSelection(dish.id)}
                                className="bg-white h-4 w-4"
                />
              </div>
            </div>
                          <CardHeader className="pb-2 px-3 pt-2">
                            <CardTitle className="text-sm font-bold truncate leading-tight" style={{ color: adminColors.primary[700] }}>
                              {dish.name}
                            </CardTitle>
                            <CardDescription className="text-xs truncate">
                  {dish.restaurant}
              </CardDescription>
            </CardHeader>
                          <CardContent className="pt-0 px-3 pb-3">
                            <div className="space-y-2">
                <div className="flex items-center justify-between">
                                <span className="text-sm font-bold" style={{ color: adminColors.primary[600] }}>
                                  {dish.price.toLocaleString("vi-VN")} đ
                  </span>
                                <Badge variant="pending" className="text-xs px-1.5 py-0">Chờ</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                                {dish.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
                              <div className="flex gap-1.5">
                  <Dialog>
                    <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7 px-2">
                                      <Eye className="mr-1 h-3 w-3" />
                        Chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{dish.name}</DialogTitle>
                        <DialogDescription>
                          Thông tin chi tiết món ăn
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Mô tả</h3>
                          <p className="text-sm text-muted-foreground">
                                          {dish.description}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Giá</h3>
                          <p className="text-lg font-bold">
                                          {dish.price.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {dish.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Quán ăn</h3>
                                        <p className="text-sm">{dish.restaurant}</p>
                        </div>
                      </div>
                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleReject(dish.id)}
                                        className="flex-1"
                                      >
                                        <X className="mr-2 h-4 w-4" />
                                        Từ chối
                                      </Button>
                    <Button
                                        onClick={() => handleApprove(dish.id)}
                                        className="flex-1 font-semibold"
                                        style={{
                                          background: adminColors.status.success,
                                          color: 'white'
                                        }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Duyệt
                    </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="sm"
                                  className="flex-1 font-semibold text-xs h-7 px-2"
                                  onClick={() => handleApprove(dish.id)}
                                  style={{
                                    background: adminColors.status.success,
                                    color: 'white'
                                  }}
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Duyệt
                                </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            /* View by Restaurants */
            <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
              <CardHeader 
                className="text-white"
                style={{ background: adminColors.gradients.primary }}
              >
                <CardTitle className="text-white text-xl font-bold">Nhà hàng có món chờ duyệt</CardTitle>
                <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                  Tổng số: {filteredRestaurantsWithPending.length} nhà hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {filteredRestaurantsWithPending.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Không tìm thấy nhà hàng nào
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRestaurantsWithPending.map((restaurant) => {
                      const isExpanded = expandedRestaurants.has(restaurant.id)
                      const selectedCount = selectedDishesByRestaurant[restaurant.id]?.length || 0
                      const allSelected = selectedCount === restaurant.dishes.length && restaurant.dishes.length > 0
                      
                      return (
                        <Card
                          key={restaurant.id}
                          className="border shadow-md bg-white"
                          style={{ borderColor: adminColors.primary[200] }}
                        >
                          <CardHeader 
                            className="pb-2"
                            style={{ 
                              background: `linear-gradient(135deg, ${adminColors.primary[50]}, rgba(230, 244, 248, 0.3))`,
                              borderBottom: `1px solid ${adminColors.primary[200]}`
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div 
                                  className="h-8 w-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                                  style={{ background: adminColors.gradients.primarySoft }}
                                >
                                  <Store className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-sm font-bold truncate" style={{ color: adminColors.primary[700] }}>
                                    {restaurant.name}
                                  </CardTitle>
                                  <CardDescription className="text-xs truncate">
                                    {restaurant.address}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant="pending" className="text-xs">
                                  {restaurant.pendingCount} món
                                </Badge>
                                {selectedCount > 0 && (
                                  <Button
                                    size="sm"
                                    className="text-xs h-7 px-2 font-semibold"
                                    onClick={() => handleBulkApproveByRestaurant(restaurant.id)}
                                    style={{
                                      background: adminColors.status.success,
                                      color: 'white'
                                    }}
                                  >
                                    <Check className="mr-1 h-3 w-3" />
                                    Duyệt ({selectedCount})
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() => toggleRestaurantExpansion(restaurant.id)}
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      <span className="text-xs">Thu gọn</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="h-3 w-3 mr-1" />
                                      <span className="text-xs">Mở rộng</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          {isExpanded && (
                            <CardContent className="pt-3">
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedDishesByRestaurant((prev) => ({
                                          ...prev,
                                          [restaurant.id]: restaurant.dishes.map(d => d.id)
                                        }))
                                      } else {
                                        setSelectedDishesByRestaurant((prev) => {
                                          const newState = { ...prev }
                                          delete newState[restaurant.id]
                                          return newState
                                        })
                                      }
                                    }}
                                  />
                                  <span className="text-xs font-semibold text-gray-600">
                                    Chọn tất cả ({restaurant.dishes.length} món)
                                  </span>
                                </div>
                                {selectedCount > 0 && (
                                  <Button
                                    size="sm"
                                    className="text-xs h-7 px-3 font-semibold"
                                    onClick={() => handleBulkApproveByRestaurant(restaurant.id)}
                                    style={{
                                      background: adminColors.status.success,
                                      color: 'white'
                                    }}
                                  >
                                    <Check className="mr-1 h-3 w-3" />
                                    Duyệt {selectedCount} món
                                  </Button>
                                )}
                              </div>
                              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {restaurant.dishes.map((dish) => {
                                  const isSelected = selectedDishesByRestaurant[restaurant.id]?.includes(dish.id) || false
                                  return (
                                    <Card
                                      key={dish.id}
                                      className={`border shadow-sm bg-white overflow-hidden transition-all ${
                                        isSelected ? 'ring-2' : ''
                                      }`}
                                      style={{ 
                                        borderColor: adminColors.primary[100],
                                        ringColor: isSelected ? adminColors.primary[400] : 'transparent'
                                      }}
                                    >
                                      <div className="relative aspect-square bg-muted">
                                        {dish.image ? (
                                          <Image
                                            src={dish.image}
                                            alt={dish.name}
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-full items-center justify-center text-muted-foreground">
                                            <Utensils className="h-8 w-8" />
                                          </div>
                                        )}
                                        <div className="absolute top-1 right-1">
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleDishSelectionByRestaurant(restaurant.id, dish.id)}
                                            className="bg-white h-4 w-4"
                                          />
                                        </div>
                                      </div>
                                      <CardHeader className="pb-1 px-2 pt-2">
                                        <CardTitle className="text-xs font-bold truncate leading-tight">
                                          {dish.name}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="pt-0 px-2 pb-2">
                                        <div className="space-y-1.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold" style={{ color: adminColors.primary[600] }}>
                                              {dish.price.toLocaleString("vi-VN")} đ
                                            </span>
                                            <Badge variant="pending" className="text-[10px] px-1 py-0">Chờ</Badge>
                                          </div>
                                          <div className="flex gap-1">
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex-1 text-[10px] h-6 px-1.5">
                                                  <Eye className="mr-0.5 h-2.5 w-2.5" />
                                                  Chi tiết
                                                </Button>
                                              </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                          <DialogHeader>
                                            <DialogTitle>{dish.name}</DialogTitle>
                                            <DialogDescription>
                                              {restaurant.name}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div>
                                              <h3 className="font-semibold mb-2">Mô tả</h3>
                                              <p className="text-sm text-muted-foreground">
                                                {dish.description}
                                              </p>
                                            </div>
                                            <div>
                                              <h3 className="font-semibold mb-2">Giá</h3>
                                              <p className="text-lg font-bold">
                                                {dish.price.toLocaleString("vi-VN")} đ
                                              </p>
                                            </div>
                                            <div>
                                              <h3 className="font-semibold mb-2">Tags</h3>
                                              <div className="flex flex-wrap gap-2">
                                                {dish.tags.map((tag) => (
                                                  <Badge key={tag} variant="outline">
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex gap-2 pt-4 border-t">
                                            <Button
                                              variant="outline"
                                              onClick={() => handleReject(dish.id)}
                                              className="flex-1"
                                            >
                                              <X className="mr-2 h-4 w-4" />
                                              Từ chối
                                            </Button>
                                            <Button
                                              onClick={() => handleApprove(dish.id)}
                                              className="flex-1 font-semibold"
                                              style={{
                                                background: adminColors.status.success,
                                                color: 'white'
                                              }}
                                            >
                                              <Check className="mr-2 h-4 w-4" />
                                              Duyệt
                                            </Button>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        size="sm"
                                        className="flex-1 text-[10px] h-6 px-1.5 font-semibold"
                                        onClick={() => handleApprove(dish.id)}
                                        style={{
                                          background: adminColors.status.success,
                                          color: 'white'
                                        }}
                                      >
                                        <Check className="mr-0.5 h-2.5 w-2.5" />
                                        Duyệt
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Danh sách nhà hàng */}
        <TabsContent value="restaurants" className="space-y-4">
          {selectedRestaurant ? (
            <div className="space-y-4">
              {/* Back Button */}
              <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedRestaurant(null)}
                    className="gap-2 font-semibold"
                    style={{ color: adminColors.primary[600] }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại danh sách nhà hàng
                  </Button>
                  <div className="mt-4 p-4 rounded-xl" style={{ background: adminColors.primary[50] }}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: adminColors.gradients.primarySoft }}
                      >
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: adminColors.primary[700] }}>
                          {selectedRestaurant.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-600">{selectedRestaurant.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dishes List */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">
                    Danh sách Món ăn
                  </CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    {selectedRestaurant.name} - Tổng số: {selectedRestaurant.dishes.length} món
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedRestaurant.dishes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Nhà hàng chưa có món ăn nào
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {selectedRestaurant.dishes.map((dish) => {
                        const isHidden = hiddenDishes.has(dish.id)
                        const displayVisible = isHidden ? !dish.isVisible : dish.isVisible
                        
                        return (
                          <Card
                            key={dish.id}
                            className={`border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-white group overflow-hidden ${
                              !displayVisible ? 'opacity-60' : ''
                            }`}
                            style={{ borderColor: adminColors.primary[200] }}
                          >
                            <div className="relative aspect-square bg-muted">
                              {dish.image ? (
                                <Image
                                  src={dish.image}
                                  alt={dish.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                  <Utensils className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                            <CardHeader className="pb-2 px-3 pt-2">
                              <CardTitle className="text-sm font-bold truncate leading-tight" style={{ color: adminColors.primary[700] }}>
                                {dish.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 px-3 pb-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold" style={{ color: adminColors.primary[600] }}>
                                    {dish.price.toLocaleString("vi-VN")} đ
                                  </span>
                                  <Badge variant={displayVisible ? "approved" : "destructive"} className="text-xs px-1.5 py-0">
                                    {displayVisible ? "Hiển thị" : "Ẩn"}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {dish.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button
                                  className="w-full font-semibold text-xs h-7"
                                  onClick={() => toggleDishVisibility(dish.id)}
                                  style={displayVisible ? {
                                    background: adminColors.status.error,
                                    color: 'white'
                                  } : {
                                    background: adminColors.status.success,
                                    color: 'white'
                                  }}
                                >
                                  {displayVisible ? (
                                    <>
                                      <EyeOff className="mr-1 h-3 w-3" />
                                      Ẩn
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-1 h-3 w-3" />
                                      Hiện
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Search */}
              <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4 md:p-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm nhà hàng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Restaurants List */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">Danh sách Nhà hàng</CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    Tổng số: {filteredAllRestaurants.length} nhà hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {filteredAllRestaurants.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Không tìm thấy nhà hàng nào
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredAllRestaurants.map((restaurant) => (
                        <Card
                          key={restaurant.id}
                          className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-white"
                          style={{ borderColor: adminColors.primary[200] }}
                          onClick={() => setSelectedRestaurant(restaurant)}
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
                                <Store className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-bold truncate" style={{ color: adminColors.primary[700] }}>
                                  {restaurant.name}
                                </CardTitle>
                                <CardDescription className="text-xs font-medium truncate">
                                  {restaurant.address}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: adminColors.primary[100] }}>
                              <div className="flex items-center gap-2">
                                <Utensils className="h-4 w-4" style={{ color: adminColors.accent.emerald }} />
                                <span className="text-sm font-semibold text-gray-600">Số món:</span>
                              </div>
                              <Badge 
                                className="font-bold px-3 py-1"
                                style={{ 
                                  background: adminColors.gradients.primarySoft,
                                  color: 'white'
                                }}
                              >
                                {restaurant.dishes.length}
                              </Badge>
                            </div>
                            <Button
                              className="w-full mt-4 font-semibold"
                              style={{
                                background: adminColors.gradients.primarySoft,
                                color: 'white'
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedRestaurant(restaurant)
                              }}
                            >
                              Xem danh sách món ăn
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
