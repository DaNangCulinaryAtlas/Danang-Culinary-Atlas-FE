"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Check, Edit, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { usePendingDishes, useRejectedDishes } from "@/hooks/queries/useDishManagement"
import { useDishes } from "@/hooks/queries/useDishes"
import DishApprovalModal from "@/components/admin/DishApprovalModal"
import DishFormModal from "@/components/admin/DishFormModal"
import DishDetailModal from "@/components/admin/DishDetailModal"
import { DishApiResponse } from "@/types/dish"
import { searchAdminDishes } from "@/services/admin"

export default function DishManagementPage() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Modal states
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState<DishApiResponse | null>(null)
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null)

  // Query hooks
  const pendingQuery = usePendingDishes({
    page,
    size: pageSize,
    sortBy: sortBy as any,
    sortDirection
  })
  const rejectedQuery = useRejectedDishes({
    page,
    size: pageSize,
    sortBy: sortBy as any,
    sortDirection
  })
  const allDishesQuery = useDishes({
    page,
    size: pageSize,
    sortBy: sortBy as any,
    sortOrder: sortDirection
  })

  const getCurrentQuery = () => {
    switch (activeTab) {
      case "pending":
        return pendingQuery
      case "rejected":
        return rejectedQuery
      case "all":
        return allDishesQuery
      default:
        return pendingQuery
    }
  }

  const currentQuery = getCurrentQuery()

  // Use search results if searching, otherwise use query data
  const displayData = searchResults || currentQuery.data?.data
  const dishes = displayData?.content || []
  const totalPages = displayData?.totalPages || 0
  const totalElements = displayData?.totalElements || 0

  const handleRowClick = (dishId: string) => {
    setSelectedDishId(dishId)
    setDetailModalOpen(true)
  }

  const handleApproveClick = (dish: DishApiResponse) => {
    setSelectedDish(dish)
    setApprovalModalOpen(true)
  }

  const handleEditClick = (dish: DishApiResponse) => {
    setSelectedDish(dish)
    setFormModalOpen(true)
  }

  const handleCreateClick = () => {
    setSelectedDish(null)
    setFormModalOpen(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setPage(0)
    setSearchQuery('')
    setSearchResults(null)

    // Update sortBy based on tab
    if (value === 'pending') {
      setSortBy('name')
    } else if (value === 'rejected') {
      setSortBy('approvedAt')
    } else if (value === 'all') {
      setSortBy('approvedAt')
    }
  }

  // Get available sort options based on active tab
  const getSortOptions = () => {
    switch (activeTab) {
      case 'pending':
        return [
          { value: 'name', label: 'Tên' },
        ]
      case 'rejected':
        return [
          { value: 'name', label: 'Tên' },
          { value: 'price', label: 'Giá' },
          { value: 'rejectedAt', label: 'Ngày từ chối' },
        ]
      case 'all':
        return [
          { value: 'name', label: 'Tên' },
          { value: 'price', label: 'Giá' },
          { value: 'approvedAt', label: 'Ngày duyệt' },
        ]
      default:
        return []
    }
  }

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults(null)
      return
    }

    if (searchQuery.trim().length < 2) {
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const statusMap = {
          pending: 'PENDING' as const,
          rejected: 'REJECTED' as const,
          all: 'APPROVED' as const,
        }

        const response = await searchAdminDishes({
          dishName: searchQuery,
          status: statusMap[activeTab as keyof typeof statusMap],
          page,
          size: pageSize,
          sortBy,
          sortDirection,
        })

        if (response.success) {
          setSearchResults(response.data)
        }
      } catch (error) {
        console.error('Failed to search dishes:', error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, activeTab, page, pageSize, sortBy, sortDirection])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-500">Còn hàng</Badge>
      case "OUT_OF_STOCK":
        return <Badge variant="secondary">Hết hàng</Badge>
      case "UNAVAILABLE":
        return <Badge variant="secondary">Không khả dụng</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Chờ duyệt</Badge>
      case "APPROVED":
        return <Badge className="bg-green-500">Đã duyệt</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Đã từ chối</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-5 md:p-6 text-white shadow-lg"
        style={{ background: adminColors.gradients.primary }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Món ăn</h1>
            <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
              Kiểm duyệt và quản lý món ăn trong hệ thống
            </p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="bg-white hover:bg-gray-100 text-gray-900"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm món ăn
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ duyệt
            {pendingQuery.data?.data?.totalElements ? (
              <Badge variant="destructive" className="ml-2">
                {pendingQuery.data.data.totalElements}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Đã từ chối
            {rejectedQuery.data?.data?.totalElements ? (
              <Badge variant="secondary" className="ml-2">
                {rejectedQuery.data.data.totalElements}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="all">Đã duyệt</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getSortOptions().map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortDirection} onValueChange={(v: any) => setSortDirection(v)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                      <SelectItem value="desc">Giảm dần</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={pageSize.toString()} onValueChange={(v) => {
                    setPageSize(parseInt(v))
                    setPage(0)
                  }}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {(currentQuery.isLoading || isSearching) ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">{isSearching ? 'Đang tìm kiếm...' : 'Đang tải...'}</span>
                </div>
              ) : currentQuery.isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Không thể tải dữ liệu. Vui lòng thử lại.</p>
                </div>
              ) : dishes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{searchQuery ? 'Không tìm thấy món ăn nào' : 'Chưa có món ăn nào'}</p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hình ảnh</TableHead>
                        <TableHead>Tên món</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Duyệt</TableHead>
                        {activeTab === "rejected" && <TableHead>Lý do từ chối</TableHead>}
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dishes.map((dish: DishApiResponse) => (
                        <TableRow
                          key={dish.dishId}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleRowClick(dish.dishId)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {dish.images && dish.images.length > 0 ? (
                              <img
                                src={dish.images[0]}
                                alt={dish.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No image</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{dish.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {dish.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{dish.price.toLocaleString('vi-VN')} đ</TableCell>
                          <TableCell>{getStatusBadge(dish.status)}</TableCell>
                          <TableCell>{getApprovalBadge(dish.approvalStatus)}</TableCell>
                          {activeTab === "rejected" && (
                            <TableCell>
                              <p className="text-sm text-red-600 line-clamp-2">
                                {dish.rejectionReason || 'Không có lý do'}
                              </p>
                            </TableCell>
                          )}
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              {dish.approvalStatus === "PENDING" && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleApproveClick(dish)
                                  }}
                                  style={{ backgroundColor: adminColors.status.success }}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Duyệt
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditClick(dish)
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Sửa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      Hiển thị {dishes.length} / {totalElements} món ăn
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">
                        Trang {page + 1} / {totalPages || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DishApprovalModal
        dish={selectedDish}
        open={approvalModalOpen}
        onOpenChange={setApprovalModalOpen}
        onSuccess={() => {
          currentQuery.refetch()
        }}
      />

      <DishFormModal
        dish={selectedDish}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        onSuccess={() => {
          currentQuery.refetch()
        }}
      />

      <DishDetailModal
        dishId={selectedDishId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={(dish) => {
          setSelectedDish(dish)
          setDetailModalOpen(false)
          setFormModalOpen(true)
        }}
        onApprove={(dish) => {
          setSelectedDish(dish)
          setDetailModalOpen(false)
          setApprovalModalOpen(true)
        }}
      />
    </div>
  )
}
