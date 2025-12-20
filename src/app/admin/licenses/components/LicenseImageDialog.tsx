import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

interface LicenseImageDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageUrl: string | null
    licenseNumber?: string
}

export default function LicenseImageDialog({
    open,
    onOpenChange,
    imageUrl,
    licenseNumber,
}: LicenseImageDialogProps) {
    if (!imageUrl) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>
                        {licenseNumber ? `Giấy phép: ${licenseNumber}` : "Giấy phép kinh doanh"}
                    </DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[70vh] p-6">
                    <Image
                        src={imageUrl}
                        alt="License document"
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
