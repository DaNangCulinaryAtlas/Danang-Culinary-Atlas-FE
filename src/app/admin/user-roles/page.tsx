"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Search, Loader2, Filter, X } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { useGetAllAccounts, useSearchAccounts, useGetAllRoles } from "@/hooks/queries/useUserRoleQueries"
import { useUpdateUserRoleLicense } from "@/hooks/mutations/useUserRoleMutations"
import { UserRolesTable } from "./components/UserRolesTable"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function UserRoleManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  // Fetch all roles for filter dropdown
  const { data: rolesData, isLoading: rolesLoading } = useGetAllRoles()

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchKeyword(searchQuery)
      setPage(0) // Reset to first page on new search
    }, 500) // 500ms debounce delay

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Reset page when filter changes
  useEffect(() => {
    setPage(0)
  }, [selectedRole, selectedStatus])

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedRole("")
    setSelectedStatus("")
    setSearchQuery("")
    setSearchKeyword("")
    setPage(0)
  }

  const hasActiveFilters = selectedRole || selectedStatus || searchQuery

  // Determine if we should search or get all
  const isSearching = searchKeyword.trim().length > 0

  // Fetch all accounts (when no search keyword)
  const allAccountsQuery = useGetAllAccounts({
    page,
    size: pageSize,
    sort: 'id,desc',
    role: selectedRole || undefined,
    status: selectedStatus || undefined,
  })

  // Search accounts (when search keyword exists) - no role/status filter in search
  const searchAccountsQuery = useSearchAccounts({
    keyword: searchKeyword,
    page,
    size: pageSize,
    sort: 'id,desc',
    enabled: isSearching,
  })

  // Use the appropriate query based on search state
  const { data, isLoading, error } = isSearching ? searchAccountsQuery : allAccountsQuery

  console.log('Data:', data, 'Is searching:', isSearching, 'Role:', selectedRole, 'Status:', selectedStatus) // Debug log

  const accounts = data?.content || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  // Update license mutation
  const updateLicenseMutation = useUpdateUserRoleLicense()

  const handleToggleExpand = (accountId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId)
    } else {
      newExpanded.add(accountId)
    }
    setExpandedRows(newExpanded)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Immediate search on Enter key
      setSearchKeyword(searchQuery)
      setPage(0)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminColors.primary[500] }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Lỗi khi tải dữ liệu</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-2xl"
        style={{ background: adminColors.gradients.primary }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
        <div className="relative flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/25"
            style={{
              background: adminColors.gradients.primarySoft,
            }}
          >
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 drop-shadow-sm">
              Quản lý tài khoản
            </h1>
            <p className="text-base md:text-lg font-medium" style={{ color: adminColors.primary[200] }}>
              Quản lý thông tin tài khoản và phân quyền người dùng
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-2 shadow-lg" style={{ borderColor: adminColors.primary[200] }}>
        <CardContent className="p-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Lọc:</span>
            </div>

            {/* Role Filter */}
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={rolesLoading ? "Đang tải..." : "Chọn Role"} />
              </SelectTrigger>
              <SelectContent>
                {rolesData?.filter(role => role.roleName !== 'SUPER_ADMIN').map((role) => (
                  <SelectItem key={role.roleId} value={role.roleName}>
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Chọn Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="BLOCKED">BLOCKED</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            )}

            {/* Active Filters Count */}
            {hasActiveFilters && (
              <span className="text-sm text-gray-500">
                ({[selectedRole, selectedStatus, searchQuery].filter(Boolean).length} bộ lọc đang áp dụng)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Roles Table */}
      <UserRolesTable
        accounts={accounts}
        totalElements={totalElements}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
        expandedRows={expandedRows}
        onToggleExpand={handleToggleExpand}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        updateLicenseMutation={updateLicenseMutation}
      />

      {/* Info Card */}
      <Card className="border-2 shadow-lg bg-white" style={{ borderColor: adminColors.primary[200] }}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: adminColors.primary[50] }}
            >
              <Users className="h-5 w-5" style={{ color: adminColors.primary[600] }} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-2" style={{ color: adminColors.primary[700] }}>
                Hướng dẫn sử dụng
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  • <strong>Tìm kiếm:</strong> Nhập tên, email hoặc Account ID để tìm kiếm
                </li>
                <li>
                  • <strong>Lọc theo Role:</strong> Chọn USER, VENDOR, hoặc ADMIN để lọc theo loại tài khoản
                </li>
                <li>
                  • <strong>Lọc theo Status:</strong> Chọn ACTIVE hoặc BLOCKED để lọc theo trạng thái
                </li>
                <li>
                  • <strong>Mở rộng:</strong> Nhấp vào nút mũi tên để xem chi tiết các role của user
                </li>
                <li>
                  • <strong>Licensed:</strong> Bật/tắt checkbox để kích hoạt hoặc khóa từng role
                </li>
                <li>
                  • <strong>Trạng thái:</strong> ✓ (xanh) = Active/Licensed, ✗ (đỏ) = Inactive/Locked
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
