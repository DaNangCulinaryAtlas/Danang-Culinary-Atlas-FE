import React from "react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { UserWithRoles } from "@/services/admin"
import { ExpandedRowContent } from "./ExpandedRowContent"
import { useUpdateUserRoleLicense } from "@/hooks/mutations/useUserRoleMutations"

interface UserRoleRowProps {
    account: UserWithRoles
    isExpanded: boolean
    onToggleExpand: (accountId: string) => void
    updateLicenseMutation: ReturnType<typeof useUpdateUserRoleLicense>
}

export function UserRoleRow({ account, isExpanded, onToggleExpand, updateLicenseMutation }: UserRoleRowProps) {
    return (
        <>
            <TableRow className="hover:bg-gray-50">
                <TableCell>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleExpand(account.accountId)}
                        className="h-8 w-8 p-0"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </TableCell>
                <TableCell className="font-medium text-xs">{account.accountId}</TableCell>
                <TableCell className="font-semibold">{account.fullName}</TableCell>
                <TableCell className="text-gray-600">{account.email}</TableCell>
                <TableCell>
                    <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                            background: adminColors.primary[100],
                            color: adminColors.primary[700],
                        }}
                    >
                        {account.role}
                    </span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {account.status === 'ACTIVE' ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600 font-semibold">Active</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600 font-semibold">{account.status}</span>
                            </>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                    {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
            </TableRow>

            {/* Expanded row showing detailed roles */}
            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={7} className="bg-gray-50 p-4">
                        <ExpandedRowContent
                            account={account}
                            updateLicenseMutation={updateLicenseMutation}
                        />
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}
