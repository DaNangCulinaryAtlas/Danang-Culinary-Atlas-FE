import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { useGetUserRoles } from "@/hooks/queries/useUserRoleQueries"
import { useUpdateUserRoleLicense } from "@/hooks/mutations/useUserRoleMutations"
import { UserWithRoles, UserRole } from "@/services/admin"

interface ExpandedRowContentProps {
    account: UserWithRoles
    updateLicenseMutation: ReturnType<typeof useUpdateUserRoleLicense>
}

export function ExpandedRowContent({ account, updateLicenseMutation }: ExpandedRowContentProps) {
    const { data: roles = [], isLoading: isLoadingRoles } = useGetUserRoles({
        userId: account.accountId,
        enabled: true,
    })

    const handleLicenseToggle = (role: UserRole) => {
        updateLicenseMutation.mutate({
            userId: account.accountId,
            roleId: role.roleId,
            licensed: !role.licensed,
        })
    }

    return (
        <div className="ml-8">
            <h4 className="font-semibold text-sm mb-3" style={{ color: adminColors.primary[700] }}>
                Chi tiết phân quyền và trạng thái licensed
            </h4>
            {isLoadingRoles ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải roles...
                </div>
            ) : roles.length === 0 ? (
                <div className="text-sm text-gray-500">
                    Không có roles nào
                </div>
            ) : (
                <div className="grid gap-2">
                    {roles.map((role) => (
                        <div
                            key={role.roleId}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-white"
                            style={{ borderColor: adminColors.primary[200] }}
                        >
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold flex-1"
                                style={{
                                    background: adminColors.primary[100],
                                    color: adminColors.primary[700],
                                }}
                            >
                                {role.roleName}
                            </span>
                            {role.description && (
                                <span className="text-xs text-gray-500 flex-1">
                                    {role.description}
                                </span>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={role.licensed}
                                        onCheckedChange={() => handleLicenseToggle(role)}
                                        disabled={updateLicenseMutation.isPending}
                                    />
                                    <span className="text-xs text-gray-600 font-medium">
                                        Licensed
                                    </span>
                                </div>
                                {role.licensed ? (
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-xs text-green-600 font-semibold">
                                            Đã kích hoạt
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-xs text-red-600 font-semibold">
                                            Đã khóa
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
