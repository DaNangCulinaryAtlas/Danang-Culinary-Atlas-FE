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
import { AlertTriangle, Loader2, Shield, Plus, Minus, Info } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { useEffect, useState } from "react"
import { getRolesWithPermissions } from "@/services/admin"
import { toast } from "react-toastify"

interface ConfirmUpdateModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading: boolean
    roles: Array<{ id: number; name: string }>
    permissionMatrix: Record<number, Record<number, boolean>>
    actions: Array<{ id: number; name: string }>
}

interface RoleChanges {
    role: string
    roleId: number
    added: Array<{ id: number; name: string }>
    removed: Array<{ id: number; name: string }>
    hasChanges: boolean
}

export default function ConfirmUpdateModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    roles,
    permissionMatrix,
    actions,
}: ConfirmUpdateModalProps) {
    const [originalPermissions, setOriginalPermissions] = useState<Record<number, number[]>>({})
    const [loadingOriginal, setLoadingOriginal] = useState(false)

    // Load original permissions khi modal mở
    useEffect(() => {
        if (isOpen && Object.keys(originalPermissions).length === 0) {
            loadOriginalPermissions()
        }
    }, [isOpen])

    const loadOriginalPermissions = async () => {
        setLoadingOriginal(true)
        try {
            const rolesWithPerms = await getRolesWithPermissions()
            const permsMap: Record<number, number[]> = {}
            rolesWithPerms.forEach((role) => {
                permsMap[role.roleId] = role.actions.map((action) => action.actionId)
            })
            setOriginalPermissions(permsMap)
        } catch (error) {
            toast.error('Lỗi khi tải quyền ban đầu', {
                position: 'top-right',
                autoClose: 2500,
            });
        } finally {
            setLoadingOriginal(false)
        }
    }

    // Tính toán thay đổi cho mỗi role
    const getChangeSummary = (): RoleChanges[] => {
        if (Object.keys(originalPermissions).length === 0) {
            return []
        }

        return roles.map((role) => {
            const currentActionIds = actions
                .filter((action) => permissionMatrix[role.id]?.[action.id])
                .map((action) => action.id)

            const originalActionIds = originalPermissions[role.id] || []

            // Tìm các action được thêm mới
            const addedIds = currentActionIds.filter((id) => !originalActionIds.includes(id))
            const addedActions = actions.filter((action) => addedIds.includes(action.id))

            // Tìm các action bị xóa
            const removedIds = originalActionIds.filter((id) => !currentActionIds.includes(id))
            const removedActions = actions.filter((action) => removedIds.includes(action.id))

            return {
                role: role.name,
                roleId: role.id,
                added: addedActions,
                removed: removedActions,
                hasChanges: addedActions.length > 0 || removedActions.length > 0,
            }
        })
    }

    const summary = getChangeSummary()
    const hasAnyChanges = summary.some((item) => item.hasChanges)
    const totalChanges = summary.reduce((acc, item) => acc + item.added.length + item.removed.length, 0)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center"
                            style={{ background: adminColors.gradients.primarySoft }}
                        >
                            <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl" style={{ color: adminColors.primary[700] }}>
                                Xác nhận cập nhật Permissions
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Hành động này sẽ thay thế toàn bộ permissions hiện tại
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {loadingOriginal ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" style={{ color: adminColors.primary[500] }} />
                            <span className="ml-2 text-sm text-gray-600">Đang kiểm tra thay đổi...</span>
                        </div>
                    ) : !hasAnyChanges ? (
                        <div
                            className="p-4 rounded-lg border-2"
                            style={{
                                background: "linear-gradient(to right, #DBEAFE, rgba(219, 234, 254, 0.3))",
                                borderColor: "#93C5FD",
                            }}
                        >
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-800 mb-1">
                                        Không có thay đổi
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Permissions hiện tại giống với cấu hình đã lưu. Không cần cập nhật.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Warning Alert */}
                            <div
                                className="p-4 rounded-lg border-2"
                                style={{
                                    background: "linear-gradient(to right, #FEF3C7, rgba(254, 243, 199, 0.3))",
                                    borderColor: "#FCD34D",
                                }}
                            >
                                <div className="flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-amber-800 mb-1">
                                            Xác nhận {totalChanges} thay đổi
                                        </p>
                                        <p className="text-xs text-amber-700">
                                            Các thay đổi bên dưới sẽ được áp dụng vào hệ thống. Vui lòng kiểm tra kỹ trước khi xác nhận.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Changes Summary */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Shield className="h-4 w-4" style={{ color: adminColors.primary[600] }} />
                                    Chi tiết thay đổi:
                                </h4>
                                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                                    {summary.filter(item => item.hasChanges).map((item) => (
                                        <div
                                            key={item.roleId}
                                            className="p-3 rounded-lg border-2 bg-white hover:shadow-md transition-shadow"
                                            style={{ borderColor: adminColors.primary[200] }}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-base" style={{ color: adminColors.primary[700] }}>
                                                    {item.role}
                                                </span>
                                                <span
                                                    className="text-xs font-semibold px-2 py-1 rounded-full"
                                                    style={{
                                                        background: adminColors.primary[50],
                                                        color: adminColors.primary[700],
                                                    }}
                                                >
                                                    {item.added.length + item.removed.length} thay đổi
                                                </span>
                                            </div>

                                            {/* Added Actions */}
                                            {item.added.length > 0 && (
                                                <div className="mb-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Plus className="h-4 w-4 text-green-600" />
                                                        <span className="text-xs font-bold text-green-700 uppercase">
                                                            Thêm mới ({item.added.length})
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-1 pl-6">
                                                        {item.added.map((action) => (
                                                            <li key={action.id} className="text-sm text-gray-700 flex items-start gap-2">
                                                                <span className="text-green-600 mt-1">+</span>
                                                                <span>{action.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Removed Actions */}
                                            {item.removed.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Minus className="h-4 w-4 text-red-600" />
                                                        <span className="text-xs font-bold text-red-700 uppercase">
                                                            Xóa bỏ ({item.removed.length})
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-1 pl-6">
                                                        {item.removed.map((action) => (
                                                            <li key={action.id} className="text-sm text-gray-700 flex items-start gap-2">
                                                                <span className="text-red-600 mt-1">-</span>
                                                                <span>{action.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading || loadingOriginal}
                        className="min-w-[100px]"
                    >
                        {hasAnyChanges ? "Hủy bỏ" : "Đóng"}
                    </Button>
                    {hasAnyChanges && !loadingOriginal && (
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="min-w-[100px]"
                            style={{
                                background: isLoading ? adminColors.primary[400] : adminColors.gradients.primary,
                                color: "white",
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Xác nhận cập nhật
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
