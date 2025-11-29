"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AccountItem } from "../types"

interface BlockConfirmDialogProps {
  account: AccountItem | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isUpdating: boolean
}

export default function BlockConfirmDialog({
  account,
  isOpen,
  onClose,
  onConfirm,
  isUpdating,
}: BlockConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận khóa tài khoản</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                Email:{" "}
                <span className="font-semibold text-foreground">{account?.email ?? "Không xác định"}</span>
              </p>
              <p>
                Họ và tên:{" "}
                <span className="font-semibold text-foreground">{account?.name ?? "Không xác định"}</span>
              </p>
              <p>Tài khoản sẽ bị khóa và không thể đăng nhập. Bạn có chắc chắn muốn tiếp tục?</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isUpdating}>
            {isUpdating ? "Đang cập nhật..." : "Khóa tài khoản"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

