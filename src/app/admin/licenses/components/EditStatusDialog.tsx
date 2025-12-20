import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Edit, Loader2 } from "lucide-react"
import { LicenseItem, ApprovalStatus } from "../types"

interface EditStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    license: LicenseItem | null
    onConfirm: (licenseId: string, status: ApprovalStatus, reason?: string) => Promise<void>
}

export default function EditStatusDialog({
    open,
    onOpenChange,
    license,
    onConfirm,
}: EditStatusDialogProps) {
    const [status, setStatus] = useState<ApprovalStatus>("APPROVED")
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (license) {
            setStatus(license.approvalStatus)
            setReason(license.rejectionReason || "")
        }
    }, [license, open])

    const handleConfirm = async () => {
        if (!license) return
        if (status === "REJECTED" && !reason.trim()) {
            return
        }

        setIsSubmitting(true)
        try {
            await onConfirm(license.licenseId, status, reason.trim() || undefined)
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getStatusLabel = (status: ApprovalStatus) => {
        switch (status) {
            case "PENDING":
                return "Chờ duyệt"
            case "APPROVED":
                return "Đã duyệt"
            case "REJECTED":
                return "Từ chối"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5 text-blue-600" />
                        Chỉnh sửa trạng thái giấy phép
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật trạng thái cho giấy phép <strong>{license?.licenseNumber}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="restaurant">Quán ăn</Label>
                        <div className="text-sm text-muted-foreground">{license?.restaurantName}</div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="owner">Chủ sở hữu</Label>
                        <div className="text-sm text-muted-foreground">{license?.ownerEmail}</div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái *</Label>
                        <Select value={status} onValueChange={(value: ApprovalStatus) => setStatus(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">{getStatusLabel("PENDING")}</SelectItem>
                                <SelectItem value="APPROVED">{getStatusLabel("APPROVED")}</SelectItem>
                                <SelectItem value="REJECTED">{getStatusLabel("REJECTED")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {status === "REJECTED" && (
                        <div className="space-y-2">
                            <Label htmlFor="reason">Lý do từ chối *</Label>
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Nhập lý do từ chối..."
                                rows={4}
                                className="resize-none"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting || (status === "REJECTED" && !reason.trim())}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
