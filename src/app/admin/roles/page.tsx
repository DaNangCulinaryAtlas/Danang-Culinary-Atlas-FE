"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, Plus, Edit, Trash2, Loader2, Search } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { getAllRoles, createRole, updateRole, deleteRole, RoleData } from "@/services/admin"
import { toast } from "react-toastify"
import RoleFormModal from "./components/RoleFormModal"
import DeleteConfirmModal from "./components/DeleteConfirmModal"

export default function RoleManagementPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null)

  // Fetch roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  })

  // Create role mutation
  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Đã tạo role mới thành công")
      setIsFormModalOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể tạo role mới")
    },
  })

  // Update role mutation
  const updateMutation = useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: any }) =>
      updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Đã cập nhật role thành công")
      setIsFormModalOpen(false)
      setSelectedRole(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể cập nhật role")
    },
  })

  // Delete role mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success("Đã xóa role thành công")
      setIsDeleteModalOpen(false)
      setSelectedRole(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể xóa role")
    },
  })

  const handleAddRole = () => {
    setSelectedRole(null)
    setIsFormModalOpen(true)
  }

  const handleEditRole = (role: RoleData) => {
    setSelectedRole(role)
    setIsFormModalOpen(true)
  }

  const handleDeleteRole = (role: RoleData) => {
    setSelectedRole(role)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = (data: { roleName: string; description?: string }) => {
    if (selectedRole) {
      // When editing, only send description (roleName cannot be changed)
      updateMutation.mutate({
        roleId: selectedRole.roleId,
        data: { description: data.description },
      })
    } else {
      // When creating, send both roleName and description
      createMutation.mutate(data)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedRole) {
      deleteMutation.mutate(selectedRole.roleId)
    }
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminColors.primary[500] }} />
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
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 drop-shadow-sm">
              Quản lý Role
            </h1>
            <p className="text-base md:text-lg font-medium" style={{ color: adminColors.primary[200] }}>
              Quản lý các vai trò trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <Card className="border-2 shadow-lg" style={{ borderColor: adminColors.primary[200] }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm role theo tên hoặc mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleAddRole}
              className="shadow-lg hover:shadow-xl transition-all"
              style={{
                background: adminColors.gradients.primarySoft,
                color: "white",
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card className="border-2 shadow-xl" style={{ borderColor: adminColors.primary[200] }}>
        <CardHeader
          className="border-b"
          style={{
            background: `linear-gradient(to right, ${adminColors.primary[50]}, rgba(12, 81, 111, 0.05), white)`,
            borderColor: adminColors.primary[200],
          }}
        >
          <CardTitle className="font-bold text-xl" style={{ color: adminColors.primary[700] }}>
            Danh sách Role
          </CardTitle>
          <CardDescription className="font-semibold" style={{ color: adminColors.primary[600] }}>
            Tổng số: {filteredRoles.length} role(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Role ID</TableHead>
                  <TableHead className="font-semibold">Tên Role</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="text-center font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Không tìm thấy role nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.roleId}>
                      <TableCell className="font-medium">{role.roleId}</TableCell>
                      <TableCell className="font-semibold">{role.roleName}</TableCell>
                      <TableCell className="text-gray-600">
                        {role.description || "Không có mô tả"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role)}
                            className="hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedRole(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedRole}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedRole(null)
        }}
        onConfirm={handleConfirmDelete}
        roleName={selectedRole?.roleName || ""}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
