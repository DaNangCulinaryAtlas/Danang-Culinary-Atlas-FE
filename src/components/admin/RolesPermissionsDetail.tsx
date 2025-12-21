"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Check, Loader2, Users, Zap } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { useRolesWithPermissions } from "@/hooks/queries/useRolesWithPermissions"
import { usePermissionConfiguration } from "@/hooks/mutations/usePermissionConfiguration"
import { useAppSelector } from "@/hooks/useRedux"
import PermissionConfigurationModal from "./PermissionConfigurationModal"
import { toast } from "sonner"

export default function RolesPermissionsDetail() {
    const { user } = useAppSelector((state) => state.auth)
    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || false

    console.log('RolesPermissionsDetail - User:', user)
    console.log('RolesPermissionsDetail - isSuperAdmin:', isSuperAdmin)

    const { data: rolesWithPermissions, isLoading, error } = useRolesWithPermissions()
    const permissionConfigMutation = usePermissionConfiguration()

    console.log('RolesPermissionsDetail - rolesWithPermissions:', rolesWithPermissions)

    // Log chi tiết từng role và actions
    if (rolesWithPermissions) {
        rolesWithPermissions.forEach(role => {
            console.log(`Role ${role.roleName}:`, {
                roleId: role.roleId,
                totalActions: role.actions.length,
                actionsWithLicense: role.actions.filter(a => a.requiresLicense).length,
                actions: role.actions.map(a => ({
                    name: a.actionName,
                    code: a.actionCode,
                    requiresLicense: a.requiresLicense
                }))
            })
        })
    }

    const [modalState, setModalState] = useState<{
        isOpen: boolean
        roleId: number
        roleName: string
        actionId: number
        actionName: string
        currentRequiresLicense: boolean
        newRequiresLicense: boolean
    } | null>(null)

    const handleToggleLicense = (
        roleId: number,
        roleName: string,
        actionId: number,
        actionName: string,
        currentRequiresLicense: boolean
    ) => {
        setModalState({
            isOpen: true,
            roleId,
            roleName,
            actionId,
            actionName,
            currentRequiresLicense,
            newRequiresLicense: !currentRequiresLicense,
        })
    }

    const handleConfirmConfiguration = async () => {
        if (!modalState) return

        try {
            await permissionConfigMutation.mutateAsync({
                roleId: modalState.roleId,
                actionId: modalState.actionId,
                requiresLicense: modalState.newRequiresLicense,
            })

            toast.success('Cập nhật cấu hình thành công', {
                description: `Action "${modalState.actionName}" cho role "${modalState.roleName}" đã được cập nhật`,
            })

            setModalState(null)
        } catch (error: any) {
            toast.error('Không thể cập nhật cấu hình', {
                description: error?.message || 'Đã có lỗi xảy ra',
            })
        }
    }

    const handleCloseModal = () => {
        if (!permissionConfigMutation.isPending) {
            setModalState(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: adminColors.primary[500] }} />
                    <p className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-sm font-semibold text-red-600">
                        Không thể tải dữ liệu roles và permissions
                    </p>
                </div>
            </div>
        )
    }

    if (!rolesWithPermissions || rolesWithPermissions.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-500">
                        Chưa có dữ liệu roles
                    </p>
                </div>
            </div>
        )
    }

    // Nhóm actions theo category dựa vào actionCode
    const groupActionsByCategory = (actions: any[]) => {
        const categories: Record<string, any[]> = {}

        actions.forEach(action => {
            const prefix = action.actionCode.split('_')[0]
            if (!categories[prefix]) {
                categories[prefix] = []
            }
            categories[prefix].push(action)
        })

        return categories
    }

    const getCategoryName = (prefix: string): string => {
        const names: Record<string, string> = {
            'DISH': 'Quản lý Món ăn',
            'RESTAURANT': 'Quản lý Nhà hàng',
            'REVIEW': 'Quản lý Đánh giá',
            'PROFILE': 'Quản lý Hồ sơ',
            'NOTIFICATION': 'Quản lý Thông báo',
            'TAG': 'Quản lý Tag',
            'REPORT': 'Quản lý Báo cáo',
            'ADMIN': 'Quản trị Hệ thống',
            'ROLE': 'Quản lý Vai trò',
            'PERMISSION': 'Quản lý Quyền hạn'
        }
        return names[prefix] || prefix
    }

    const getRoleColor = (roleName: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            'SUPER_ADMIN': {
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                border: 'border-purple-200'
            },
            'ADMIN': {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200'
            },
            'VENDOR': {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200'
            },
            'USER': {
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200'
            }
        }
        return colors[roleName] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    }

    return (
        <div className="space-y-4">
            {/* Info banner for SUPER_ADMIN */}
            {isSuperAdmin && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-orange-900 text-sm">Chế độ Cấu hình Nâng cao</p>
                            <p className="text-xs text-orange-700 mt-0.5">
                                Bạn có thể toggle switch để cấu hình action thành "Mặc định" hoặc "Nâng cao"
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rolesWithPermissions.map((role) => {
                const roleColor = getRoleColor(role.roleName)
                const categorizedActions = groupActionsByCategory(role.actions)

                return (
                    <Card
                        key={role.roleId}
                        className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${roleColor.border}`}
                    >
                        <CardHeader className={`border-b ${roleColor.bg}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className={`text-xl font-bold ${roleColor.text} flex items-center gap-2`}>
                                        <Shield className="h-5 w-5" />
                                        {role.roleName}
                                    </CardTitle>
                                    {role.description && (
                                        <CardDescription className="mt-2 text-sm">
                                            {role.description}
                                        </CardDescription>
                                    )}
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`${roleColor.bg} ${roleColor.text} font-semibold`}
                                >
                                    {role.actions.length} quyền
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 max-h-[500px] overflow-y-auto">
                            <div className="space-y-4">
                                {Object.entries(categorizedActions).map(([category, actions]) => (
                                    <div key={category}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            {getCategoryName(category)}
                                        </h4>
                                        <div className="space-y-1.5">
                                            {actions.map((action) => (
                                                <div
                                                    key={action.actionId}
                                                    className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                                >
                                                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: adminColors.status.success }} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-700 leading-tight">
                                                            {action.actionName}
                                                            {action.requiresLicense && (
                                                                <span className="text-orange-500 ml-1" title="Yêu cầu License">
                                                                    ⚡
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                            {action.actionCode}
                                                        </p>
                                                    </div>

                                                    {/* Toggle License Configuration - Only for SUPER_ADMIN */}
                                                    {isSuperAdmin && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1.5 bg-white border-2 rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md transition-all">
                                                                <span className="text-xs font-semibold text-gray-600">
                                                                    {action.requiresLicense ? 'Nâng cao' : 'Mặc định'}
                                                                </span>
                                                                <Switch
                                                                    checked={action.requiresLicense || false}
                                                                    onCheckedChange={() =>
                                                                        handleToggleLicense(
                                                                            role.roleId,
                                                                            role.roleName,
                                                                            action.actionId,
                                                                            action.actionName,
                                                                            action.requiresLicense || false
                                                                        )
                                                                    }
                                                                    className="data-[state=checked]:bg-orange-500"
                                                                />
                                                                <Zap className="h-3.5 w-3.5 text-orange-500" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
            </div>

            {/* Permission Configuration Modal */}
            {modalState && (
                <PermissionConfigurationModal
                    isOpen={modalState.isOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmConfiguration}
                    isLoading={permissionConfigMutation.isPending}
                    roleName={modalState.roleName}
                    actionName={modalState.actionName}
                    currentRequiresLicense={modalState.currentRequiresLicense}
                    newRequiresLicense={modalState.newRequiresLicense}
                />
            )}
        </div>
    )
}
