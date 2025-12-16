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
import { AlertTriangle, Loader2 } from "lucide-react"

interface VendorConfirmDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading: boolean
    restaurantName: string
}

export function VendorConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    restaurantName,
}: VendorConfirmDeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="p-2 rounded-full bg-red-100"
                        >
                            <AlertTriangle
                                className="h-6 w-6 text-red-600"
                            />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            Xác nhận xóa quán ăn
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-base pt-2">
                        Bạn có chắc chắn muốn xóa quán ăn <strong>{restaurantName}</strong> không?
                        <br />
                        <br />
                        <span className="text-red-600 font-medium">
                            Hành động này không thể hoàn tác và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Đang xóa...' : 'Xóa quán ăn'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
