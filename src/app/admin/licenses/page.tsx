"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminColors } from "@/configs/colors"
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
import { Eye, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight, Filter, Edit } from "lucide-react"
import { useAdminLicenses } from "@/hooks/queries/useAdminLicenses"
import { useUpdateLicenseStatusGeneric } from "@/hooks/mutations/useAdminLicenseMutations"
import {
    formatDate,
    getLicenseTypeLabel,
    getApprovalStatusLabel,
    getLicenseTypeColor,
    getApprovalStatusColor,
    isLicenseExpired,
} from "./utils/licenseUtils"
import Toast from "./components/Toast"
import LicenseImageDialog from "./components/LicenseImageDialog"
import ApproveLicenseDialog from "./components/ApproveLicenseDialog"
import RejectLicenseDialog from "./components/RejectLicenseDialog"
import EditStatusDialog from "./components/EditStatusDialog"
import type { LicenseItem, LicenseFilters, ApprovalStatus } from "./types"

export default function LicenseManagement() {
    const [isMounted, setIsMounted] = useState(false)
    const [filters, setFilters] = useState<LicenseFilters>({
        licenseType: 'ALL',
        approvalStatus: 'ALL',
    })
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

    // Image dialog
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

    // Approve dialog
    const [licenseToApprove, setLicenseToApprove] = useState<LicenseItem | null>(null)
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)

    // Reject dialog
    const [licenseToReject, setLicenseToReject] = useState<LicenseItem | null>(null)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

    // Edit status dialog
    const [licenseToEdit, setLicenseToEdit] = useState<LicenseItem | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const { data, isLoading, error } = useAdminLicenses({
        filters,
        page,
        pageSize,
    })

    const licenses = data?.licenses || []
    const totalLicenses = data?.totalLicenses || 0
    const totalPages = data?.totalPages || 1

    const { updateStatus, isPending: isProcessing } = useUpdateLicenseStatusGeneric()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setPage(0)
    }, [filters])

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }



    const handleViewImage = (url: string) => {
        setSelectedImageUrl(url)
        setIsImageDialogOpen(true)
    }

    const handleApproveClick = (license: LicenseItem) => {
        setLicenseToApprove(license)
        setIsApproveDialogOpen(true)
    }

    const handleRejectClick = (license: LicenseItem) => {
        setLicenseToReject(license)
        setIsRejectDialogOpen(true)
    }

    const handleConfirmApprove = async (licenseId: string) => {
        try {
            if (!licenseToApprove) return
            await updateStatus(licenseId, "APPROVED")
            showToast("success", "Đã duyệt giấy phép thành công")
        } catch (error) {
            showToast("error", "Duyệt giấy phép thất bại")
        }
    }

    const handleConfirmReject = async (licenseId: string, reason: string) => {
        try {
            if (!licenseToReject) return
            await updateStatus(licenseId, "REJECTED", reason)
            showToast("success", "Đã từ chối giấy phép")
        } catch (error) {
            showToast("error", "Từ chối giấy phép thất bại")
        }
    }

    const handleEditClick = (license: LicenseItem) => {
        setLicenseToEdit(license)
        setIsEditDialogOpen(true)
    }

    const handleConfirmEdit = async (licenseId: string, status: ApprovalStatus, reason?: string) => {
        try {
            if (!licenseToEdit) return
            await updateStatus(licenseId, status, reason)
            showToast("success", "Đã cập nhật trạng thái giấy phép thành công")
        } catch (error) {
            showToast("error", "Cập nhật trạng thái giấy phép thất bại")
        }
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="space-y-6">
            {toast && <Toast type={toast.type} message={toast.message} />}

            <div
                className="rounded-xl p-5 md:p-6 text-white shadow-lg"
                style={{ background: adminColors.gradients.primary }}
            >
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Giấy phép</h1>
                <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
                    Kiểm duyệt và quản lý giấy phép kinh doanh, chứng nhận ATTP của các quán ăn
                </p>
            </div>

            <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium text-muted-foreground">Bộ lọc:</span>
                        <div className="flex gap-3 flex-1 flex-wrap">
                            <Select
                                value={filters.licenseType}
                                onValueChange={(value: any) =>
                                    setFilters((prev) => ({ ...prev, licenseType: value }))
                                }
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Loại giấy phép" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả loại</SelectItem>
                                    <SelectItem value="BUSINESS_REGISTRATION">Giấy phép KD</SelectItem>
                                    <SelectItem value="FOOD_SAFETY_CERT">Chứng nhận ATTP</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.approvalStatus}
                                onValueChange={(value: any) =>
                                    setFilters((prev) => ({ ...prev, approvalStatus: value }))
                                }
                            >
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                                    <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                    <SelectItem value="REJECTED">Từ chối</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader className="text-white" style={{ background: adminColors.gradients.primary }}>
                    <CardTitle className="text-white text-xl font-bold">Danh sách Giấy phép</CardTitle>
                    <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                        {error ? "Có lỗi xảy ra khi tải dữ liệu" : `Tổng: ${totalLicenses} giấy phép`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Đang tải dữ liệu...
                        </div>
                    ) : licenses.length === 0 ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            Không tìm thấy giấy phép phù hợp với bộ lọc hiện tại.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Số giấy phép</TableHead>
                                        <TableHead>Quán ăn</TableHead>
                                        <TableHead>Chủ sở hữu</TableHead>
                                        <TableHead>Loại giấy phép</TableHead>
                                        <TableHead>Ngày cấp</TableHead>
                                        <TableHead>Ngày hết hạn</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {licenses.map((license) => {
                                        const licenseTypeColor = getLicenseTypeColor(license.licenseType)
                                        const approvalStatusColor = getApprovalStatusColor(license.approvalStatus)
                                        const expired = isLicenseExpired(license.expireDate)

                                        return (
                                            <TableRow key={license.licenseId}>
                                                <TableCell className="font-medium">{license.licenseNumber}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{license.restaurantName}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ID: {license.restaurantId.slice(0, 8)}...
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{license.ownerEmail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${licenseTypeColor.bg} ${licenseTypeColor.text} hover:${licenseTypeColor.bg} hover:${licenseTypeColor.text} border-0`}>
                                                        {getLicenseTypeLabel(license.licenseType)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatDate(license.issueDate)}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>{formatDate(license.expireDate)}</span>
                                                        {expired && (
                                                            <span className="text-xs text-red-600 font-medium">Đã hết hạn</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`${approvalStatusColor.bg} ${approvalStatusColor.text} hover:${approvalStatusColor.bg} hover:${approvalStatusColor.text} border-0 cursor-default`}
                                                        title={license.approvalStatus === "REJECTED" && license.rejectionReason ? `Lý do: ${license.rejectionReason}` : undefined}
                                                    >
                                                        {getApprovalStatusLabel(license.approvalStatus)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewImage(license.documentUrl)}
                                                            title="Xem giấy phép"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {license.approvalStatus === "PENDING" && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleApproveClick(license)}
                                                                    disabled={isProcessing}
                                                                    title="Duyệt giấy phép"
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                >
                                                                    {isProcessing ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRejectClick(license)}
                                                                    disabled={isProcessing}
                                                                    title="Từ chối giấy phép"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {(license.approvalStatus === "APPROVED" || license.approvalStatus === "REJECTED") && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditClick(license)}
                                                                disabled={isProcessing}
                                                                title="Chỉnh sửa trạng thái"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && licenses.length > 0 && (
                <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Hiển thị</span>
                                <Select
                                    value={String(pageSize)}
                                    onValueChange={(value) => {
                                        setPageSize(Number(value))
                                        setPage(0)
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
                                    trên tổng {totalLicenses} giấy phép
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Previous button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0 || isLoading}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* First page button */}
                                {page > 2 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(0)}
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
                                            onClick={() => setPage(pageNum)}
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
                                            onClick={() => setPage(totalPages - 1)}
                                        >
                                            {totalPages}
                                        </Button>
                                    </>
                                )}

                                {/* Next button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1 || isLoading}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Dialogs */}
            <LicenseImageDialog
                open={isImageDialogOpen}
                onOpenChange={setIsImageDialogOpen}
                imageUrl={selectedImageUrl}
                licenseNumber={
                    licenses.find((l) => l.documentUrl === selectedImageUrl)?.licenseNumber
                }
            />

            <ApproveLicenseDialog
                open={isApproveDialogOpen}
                onOpenChange={setIsApproveDialogOpen}
                license={licenseToApprove}
                onConfirm={handleConfirmApprove}
                isProcessing={isProcessing}
            />

            <RejectLicenseDialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
                license={licenseToReject}
                onConfirm={handleConfirmReject}
            />

            <EditStatusDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                license={licenseToEdit}
                onConfirm={handleConfirmEdit}
            />
        </div>
    )
}
