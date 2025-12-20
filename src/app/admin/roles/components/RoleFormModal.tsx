"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { RoleData } from "@/services/admin"

interface RoleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { roleName: string; description?: string }) => void
  initialData?: RoleData | null
  isLoading?: boolean
}

export default function RoleFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: RoleFormModalProps) {
  const [roleName, setRoleName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.roleName)
      setDescription(initialData.description || "")
    } else {
      setRoleName("")
      setDescription("")
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) return

    onSubmit({
      roleName: roleName.trim().toUpperCase(),
      description: description.trim() || undefined,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa Role" : "Thêm Role mới"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Cập nhật thông tin role"
              : "Điền thông tin để tạo role mới"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">
              Tên Role <span className="text-red-500">*</span>
            </Label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value.toUpperCase())}
              placeholder="Ví dụ: CONTENT_MODERATOR"
              required
              disabled={isLoading || !!initialData}
              className="uppercase"
            />
            <p className="text-xs text-gray-500">
              {initialData
                ? "Tên role không thể thay đổi"
                : "Tên role sẽ tự động chuyển sang chữ HOA và phải là duy nhất"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả vai trò..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !roleName.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
