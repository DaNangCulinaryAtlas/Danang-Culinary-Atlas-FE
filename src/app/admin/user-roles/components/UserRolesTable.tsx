import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { adminColors } from "@/configs/colors"
import { UserWithRoles } from "@/services/admin"
import { UserRoleRow } from "./UserRoleRow"
import { useUpdateUserRoleLicense } from "@/hooks/mutations/useUserRoleMutations"

interface UserRolesTableProps {
    accounts: UserWithRoles[]
    totalElements: number
    totalPages: number
    page: number
    pageSize: number
    expandedRows: Set<string>
    onToggleExpand: (accountId: string) => void
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    updateLicenseMutation: ReturnType<typeof useUpdateUserRoleLicense>
}

export function UserRolesTable({
    accounts,
    totalElements,
    totalPages,
    page,
    pageSize,
    expandedRows,
    onToggleExpand,
    onPageChange,
    onPageSizeChange,
    updateLicenseMutation,
}: UserRolesTableProps) {
    return (
        <Card className="border-2 shadow-xl" style={{ borderColor: adminColors.primary[200] }}>
            <CardHeader
                className="border-b"
                style={{
                    background: `linear-gradient(to right, ${adminColors.primary[50]}, rgba(12, 81, 111, 0.05), white)`,
                    borderColor: adminColors.primary[200],
                }}
            >
                <CardTitle className="font-bold text-xl" style={{ color: adminColors.primary[700] }}>
                    Danh sách tài khoản
                </CardTitle>
                <CardDescription className="font-semibold" style={{ color: adminColors.primary[600] }}>
                    Tổng số: {totalElements} tài khoản
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold w-[50px]"></TableHead>
                                <TableHead className="font-semibold">Account ID</TableHead>
                                <TableHead className="font-semibold">Tên đầy đủ</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Role chính</TableHead>
                                <TableHead className="font-semibold">Trạng thái</TableHead>
                                <TableHead className="font-semibold">Ngày tạo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                                        Không tìm thấy tài khoản nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                accounts.map((account) => (
                                    <UserRoleRow
                                        key={account.accountId}
                                        account={account}
                                        isExpanded={expandedRows.has(account.accountId)}
                                        onToggleExpand={onToggleExpand}
                                        updateLicenseMutation={updateLicenseMutation}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Hiển thị</span>
                            <Select
                                value={String(pageSize)}
                                onValueChange={(value) => {
                                    onPageSizeChange(Number(value))
                                    onPageChange(0)
                                }}
                            >
                                <SelectTrigger className="w-[70px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">
                                trên tổng {totalElements} tài khoản
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Previous button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {/* First page button */}
                            {page > 2 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(0)}
                                    >
                                        1
                                    </Button>
                                    {page > 3 && (
                                        <span className="flex items-center px-2">...</span>
                                    )}
                                </>
                            )}

                            {/* Page numbers around current page */}
                            {Array.from({ length: totalPages }, (_, i) => i)
                                .filter(
                                    (pageNum) =>
                                        pageNum === page ||
                                        pageNum === page - 1 ||
                                        pageNum === page - 2 ||
                                        pageNum === page + 1 ||
                                        pageNum === page + 2
                                )
                                .map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNum)}
                                    >
                                        {pageNum + 1}
                                    </Button>
                                ))}

                            {/* Last page button */}
                            {page < totalPages - 3 && (
                                <>
                                    {page < totalPages - 4 && (
                                        <span className="flex items-center px-2">...</span>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(totalPages - 1)}
                                    >
                                        {totalPages}
                                    </Button>
                                </>
                            )}

                            {/* Next button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
