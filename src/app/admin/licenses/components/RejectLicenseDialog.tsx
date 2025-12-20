import React, { useState } from "react"
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
import { AlertCircle, Loader2 } from "lucide-react"
import { LicenseItem } from "../types"

interface RejectLicenseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    license: LicenseItem | null
    onConfirm: (licenseId: string, reason: string) => Promise<void>
}

export default function RejectLicenseDialog({
    open,
    onOpenChange,
    license,
    onConfirm,
}: RejectLicenseDialogProps) {
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirm = async () => {
        if (!license || !reason.trim()) return
        setIsSubmitting(true)
        try {
            await onConfirm(license.licenseId, reason.trim())
            setReason("")
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Từ chối giấy phép
                    </DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập lý do từ chối giấy phép <strong>{license?.licenseNumber}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lý do từ chối *</label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                            rows={4}
                            className="resize-none"
                            disabled={isSubmitting}
                        />
                    </div>
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
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!reason.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận từ chối"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
