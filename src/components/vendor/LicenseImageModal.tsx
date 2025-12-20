"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"

interface LicenseImageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageUrl: string | null
}

export function LicenseImageModal({ open, onOpenChange, imageUrl }: LicenseImageModalProps) {
    if (!imageUrl) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Giấy phép kinh doanh</DialogTitle>
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
