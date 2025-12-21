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
import { Shield, AlertTriangle, Loader2 } from "lucide-react"
import { adminColors } from "@/configs/colors"

interface PermissionConfigurationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading: boolean
    roleName: string
    actionName: string
    currentRequiresLicense: boolean
    newRequiresLicense: boolean
}

export default function PermissionConfigurationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    roleName,
    actionName,
    currentRequiresLicense,
    newRequiresLicense,
}: PermissionConfigurationModalProps) {
    const isUpgrading = !currentRequiresLicense && newRequiresLicense
    const isDowngrading = currentRequiresLicense && !newRequiresLicense

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center"
                            style={{
                                background: isUpgrading
                                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                                    : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            }}
                        >
                            {isUpgrading ? (
                                <AlertTriangle className="h-6 w-6 text-white" />
                            ) : (
                                <Shield className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold" style={{ color: adminColors.primary[700] }}>
                                Xác nhận Cấu hình Permission
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-base">
                        {isUpgrading ? (
                            <span>
                                Bạn đang chuyển action này từ <strong className="text-blue-600">Mặc định</strong> sang{" "}
                                <strong className="text-orange-600">Nâng cao</strong>
                            </span>
                        ) : isDowngrading ? (
                            <span>
                                Bạn đang chuyển action này từ <strong className="text-orange-600">Nâng cao</strong> về{" "}
                                <strong className="text-blue-600">Mặc định</strong>
                            </span>
                        ) : (
                            <span>Bạn đang thay đổi cấu hình permission</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Role & Action Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role</p>
                            <p className="text-sm font-bold" style={{ color: adminColors.primary[700] }}>
                                {roleName}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Action</p>
                            <p className="text-sm font-bold" style={{ color: adminColors.primary[700] }}>
                                {actionName}
                            </p>
                        </div>
                    </div>

                    {/* Configuration Change */}
                    <div
                        className="border-2 rounded-lg p-4"
                        style={{
                            borderColor: isUpgrading ? '#f59e0b' : '#3b82f6',
                            background: isUpgrading ? '#fffbeb' : '#eff6ff',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Trạng thái hiện tại</p>
                                <p className="text-sm font-bold">
                                    {currentRequiresLicense ? (
                                        <span className="text-orange-600">⚡ Action Nâng cao</span>
                                    ) : (
                                        <span className="text-blue-600">Action Mặc định</span>
                                    )}
                                </p>
                            </div>
                            <div className="text-2xl">→</div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">Trạng thái mới</p>
                                <p className="text-sm font-bold">
                                    {newRequiresLicense ? (
                                        <span className="text-orange-600">Action Nâng cao</span>
                                    ) : (
                                        <span className="text-blue-600">Action Mặc định</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning Message */}
                    {isUpgrading && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-orange-800">
                                    <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Action này sẽ trở thành <strong>Action Nâng cao</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{
                            background: isUpgrading
                                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                : adminColors.gradients.primarySoft,
                            color: 'white',
                        }}
                        className="min-w-[120px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Shield className="mr-2 h-4 w-4" />
                                Xác nhận
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
