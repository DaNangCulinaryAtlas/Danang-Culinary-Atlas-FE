"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, Loader2, Users } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { useRolesWithPermissions } from "@/hooks/queries/useRolesWithPermissions"

export default function RolesPermissionsDetail() {
    const { data: rolesWithPermissions, isLoading, error } = useRolesWithPermissions()

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rolesWithPermissions.map((role) => {
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
                                                    className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: adminColors.status.success }} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-700 leading-tight">
                                                            {action.actionName}
                                                        </p>
                                                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                            {action.actionCode}
                                                        </p>
                                                    </div>
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
    )
}
