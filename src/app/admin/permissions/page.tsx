"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Save, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { usePermissions } from "../../../services/permission-role"
import Notification from "./components/Notification"
import PermissionMatrix from "./components/PermissionMatrix"
import RolesPermissionsDetail from "@/components/admin/RolesPermissionsDetail"
import ConfirmUpdateModal from "@/components/admin/ConfirmUpdateModal"

export default function PermissionsManagement() {
  const [notification, setNotification] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const { roles, actions, permissionMatrix, isLoading, error, updatePermission, savePermissions } =
    usePermissions()

  useEffect(() => {
    if (error) {
      setNotification({ type: "error", message: error })
      setTimeout(() => setNotification({ type: null, message: "" }), 3000)
    }
  }, [error])

  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true)
  }

  const handleCloseConfirmModal = () => {
    if (!isSaving) {
      setShowConfirmModal(false)
    }
  }

  const handleConfirmSave = async () => {
    setIsSaving(true)
    try {
      const result = await savePermissions()
      setNotification({
        type: result.success ? "success" : "error",
        message: result.message,
      })
      setTimeout(() => setNotification({ type: null, message: "" }), 3000)

      if (result.success) {
        setShowConfirmModal(false)
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Không thể cập nhật permissions",
      })
      setTimeout(() => setNotification({ type: null, message: "" }), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminColors.primary[500] }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Notification type={notification.type} message={notification.message} />

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
              Quản trị Permission
            </h1>
            <p className="text-base md:text-lg font-medium" style={{ color: adminColors.primary[200] }}>
              Quản lý phân quyền cho từng role trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <Card
        className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white"
        style={{ borderColor: adminColors.primary[200] }}
      >
        <CardHeader
          className="border-b"
          style={{
            background: `linear-gradient(to right, ${adminColors.primary[50]}, rgba(12, 81, 111, 0.05), white)`,
            borderColor: adminColors.primary[200],
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-bold text-xl" style={{ color: adminColors.primary[700] }}>
                Ma trận Phân quyền
              </CardTitle>
              <CardDescription className="font-semibold mt-1" style={{ color: adminColors.primary[600] }}>
                Chọn checkbox để cấp quyền cho role tương ứng
              </CardDescription>
            </div>
            <Button
              onClick={handleOpenConfirmModal}
              disabled={isSaving}
              className="shadow-lg hover:shadow-xl transition-all"
              style={{
                background: adminColors.gradients.primarySoft,
                color: "white",
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <PermissionMatrix
            roles={roles}
            actions={actions}
            permissionMatrix={permissionMatrix}
            onPermissionChange={updatePermission}
          />
        </CardContent>
      </Card>

      {/* Roles & Permissions Detail Section */}
      <Card
        className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white"
        style={{ borderColor: adminColors.accent.emerald }}
      >
        <CardHeader
          className="border-b"
          style={{
            background: `linear-gradient(to right, #D1FAE5, rgba(209, 250, 229, 0.5), white)`,
            borderColor: '#A7F3D0'
          }}
        >
          <CardTitle className="font-bold text-lg" style={{ color: '#059669' }}>
            Chi tiết Roles & Permissions
          </CardTitle>
          <CardDescription className="font-semibold" style={{ color: adminColors.accent.emerald }}>
            Xem tổng quan phân quyền chi tiết cho từng role
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <RolesPermissionsDetail />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-2 shadow-lg bg-white" style={{ borderColor: adminColors.primary[200] }}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: adminColors.primary[50] }}
            >
              <Shield className="h-5 w-5" style={{ color: adminColors.primary[600] }} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-2" style={{ color: adminColors.primary[700] }}>
                Hướng dẫn sử dụng
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  • <strong>Cột:</strong> Đại diện cho các role trong hệ thống (User, Vendor, Admin)
                </li>
                <li>
                  • <strong>Hàng:</strong> Đại diện cho các action/permission có thể thực hiện
                </li>
                <li>
                  • <strong>Checkbox:</strong> Tích vào để cấp quyền, bỏ tích để thu hồi quyền
                </li>
                <li>
                  • Nhấn <strong>"Lưu thay đổi"</strong> để áp dụng các thay đổi vào hệ thống
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Update Modal */}
      <ConfirmUpdateModal
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
        roles={roles}
        permissionMatrix={permissionMatrix}
        actions={actions}
      />
    </div>
  )
}
