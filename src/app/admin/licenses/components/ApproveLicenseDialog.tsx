import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { LicenseItem } from "../types"

interface ApproveLicenseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    license: LicenseItem | null
    onConfirm: (licenseId: string) => Promise<void>
    isProcessing: boolean
}

export default function ApproveLicenseDialog({
    open,
    onOpenChange,
    license,
    onConfirm,
    isProcessing,
}: ApproveLicenseDialogProps) {
    const handleConfirm = async () => {
        if (!license) return
        await onConfirm(license.licenseId)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Duyệt giấy phép
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn duyệt giấy phép <strong>{license?.licenseNumber}</strong> không?
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Quán ăn:</span> {license?.restaurantName}
                    </p>
                    <p>
                        <span className="font-medium">Chủ sở hữu:</span> {license?.ownerEmail}
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessing}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận duyệt"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
