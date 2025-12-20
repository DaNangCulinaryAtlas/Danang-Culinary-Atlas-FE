"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, File, X, Trash2 } from "lucide-react"
import { useCreateLicense, useUpdateLicense, useDeleteLicense } from "@/hooks/mutations/useLicenseMutations"
import type { License, LicenseType } from "@/types/license"
import { toast } from "react-toastify"
import { uploadImageToCloudinary } from "@/services/upload-image"

interface LicenseFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    license?: License | null
    restaurantId?: string
    restaurantName?: string
    restaurants?: Array<{ id: string; name: string }>
}

export function LicenseFormModal({
    open,
    onOpenChange,
    license,
    restaurantId: propRestaurantId,
    restaurantName: propRestaurantName,
    restaurants = []
}: LicenseFormModalProps) {
    const [restaurantId, setRestaurantId] = useState("")
    const [licenseType, setLicenseType] = useState<LicenseType>("BUSINESS_REGISTRATION")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [issueDate, setIssueDate] = useState("")
    const [expireDate, setExpireDate] = useState("")
    const [documentFile, setDocumentFile] = useState<File | null>(null)
    const [documentUrl, setDocumentUrl] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const createMutation = useCreateLicense()
    const updateMutation = useUpdateLicense()
    const deleteMutation = useDeleteLicense()

    const isEditing = !!license

    useEffect(() => {
        if (license) {
            setRestaurantId(license.restaurantId)
            setLicenseType(license.licenseType)
            setLicenseNumber(license.licenseNumber)
            setIssueDate(license.issueDate)
            setExpireDate(license.expireDate || "")
            setDocumentUrl(license.documentUrl)
        } else {
            resetForm()
            // Set default restaurant if provided
            if (propRestaurantId) {
                setRestaurantId(propRestaurantId)
            }
        }
    }, [license, open, propRestaurantId])

    // Auto-calculate expiry date for FOOD_SAFETY_CERT (3 years after issue date)
    useEffect(() => {
        if (licenseType === 'FOOD_SAFETY_CERT' && issueDate && !isEditing) {
            const issue = new Date(issueDate)
            const expire = new Date(issue)
            expire.setFullYear(expire.getFullYear() + 3)

            // Format to YYYY-MM-DD for input[type="date"]
            const expireDateString = expire.toISOString().split('T')[0]
            setExpireDate(expireDateString)
        } else if (licenseType === 'BUSINESS_REGISTRATION' && !isEditing) {
            // Clear expiry date for business registration when switching types
            setExpireDate("")
        }
    }, [licenseType, issueDate, isEditing])

    const resetForm = () => {
        setRestaurantId(propRestaurantId || "")
        setLicenseType("BUSINESS_REGISTRATION")
        setLicenseNumber("")
        setIssueDate("")
        setExpireDate("")
        setDocumentFile(null)
        setDocumentUrl("")
        setShowDeleteConfirm(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type - only accept images
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            toast.error('Chỉ chấp nhận file hình ảnh (JPG, PNG)', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        // Validate file size (max 5MB for images)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File không được vượt quá 5MB', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        setDocumentFile(file)
    }

    const handleRemoveFile = () => {
        setDocumentFile(null)
        setDocumentUrl("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!restaurantId) {
            toast.error('Vui lòng chọn nhà hàng', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        if (!licenseNumber.trim()) {
            toast.error('Vui lòng nhập số giấy phép', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        if (!issueDate) {
            toast.error('Vui lòng chọn ngày cấp', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        // expireDate is auto-calculated for FOOD_SAFETY_CERT, no need to validate

        if (!isEditing && !documentFile && !documentUrl) {
            toast.error('Vui lòng tải lên file giấy phép', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        // Check dates if expireDate is provided
        if (expireDate && new Date(expireDate) <= new Date(issueDate)) {
            toast.error('Ngày hết hạn phải sau ngày cấp', {
                position: 'top-right',
                autoClose: 3000,
            })
            return
        }

        try {
            let finalDocumentUrl = documentUrl

            // Upload file to Cloudinary if a new file is selected
            if (documentFile) {
                setIsUploading(true)
                const uploadResponse = await uploadImageToCloudinary(documentFile)
                if (uploadResponse.success && uploadResponse.data) {
                    finalDocumentUrl = uploadResponse.data
                } else {
                    throw new Error('Upload failed')
                }
                setIsUploading(false)
            }

            const data: any = {
                restaurantId,
                licenseNumber: licenseNumber.trim(),
                issueDate,
                documentUrl: finalDocumentUrl,
                licenseType
            }

            // Only add expireDate if it's provided
            if (expireDate) {
                data.expireDate = expireDate
            }

            if (isEditing && license) {
                await updateMutation.mutateAsync({ licenseId: license.licenseId, data })
            } else {
                await createMutation.mutateAsync(data)
            }

            onOpenChange(false)
            resetForm()
        } catch (error) {
            setIsUploading(false)
            toast.error('Có lỗi xảy ra khi tải file lên. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            })
        }
    }

    const handleDelete = async () => {
        if (!license) return

        try {
            await deleteMutation.mutateAsync(license.licenseId)
            onOpenChange(false)
            resetForm()
        } catch (error) {
            // Error is already handled in the mutation
        }
    }

    const isLoading = createMutation.isPending || updateMutation.isPending || isUploading || deleteMutation.isPending

    const getLicenseTypeLabel = (type: LicenseType) => {
        switch (type) {
            case 'BUSINESS_REGISTRATION':
                return 'Giấy phép đăng ký kinh doanh'
            case 'FOOD_SAFETY_CERT':
                return 'Giấy chứng nhận an toàn thực phẩm'
            default:
                return type
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Cập nhật giấy phép' : 'Thêm giấy phép'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Cập nhật thông tin giấy phép' : 'Điền thông tin và tải lên giấy phép của nhà hàng'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Restaurant Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="restaurant">
                            Nhà hàng <span className="text-red-500">*</span>
                        </Label>
                        {propRestaurantId ? (
                            <Input
                                value={propRestaurantName || ""}
                                disabled
                                className="bg-gray-50"
                            />
                        ) : (
                            <Select
                                value={restaurantId}
                                onValueChange={setRestaurantId}
                                disabled={isLoading || isEditing}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {restaurants.map((restaurant) => (
                                        <SelectItem key={restaurant.id} value={restaurant.id}>
                                            {restaurant.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* License Type */}
                    <div className="space-y-2">
                        <Label htmlFor="licenseType">
                            Loại giấy phép <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={licenseType}
                            onValueChange={(value) => setLicenseType(value as LicenseType)}
                            disabled={isLoading || isEditing}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUSINESS_REGISTRATION">
                                    {getLicenseTypeLabel("BUSINESS_REGISTRATION")}
                                </SelectItem>
                                <SelectItem value="FOOD_SAFETY_CERT">
                                    {getLicenseTypeLabel("FOOD_SAFETY_CERT")}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* License Number */}
                    <div className="space-y-2">
                        <Label htmlFor="licenseNumber">
                            Số giấy phép <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="licenseNumber"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="Nhập số giấy phép"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Issue Date */}
                    <div className="space-y-2">
                        <Label htmlFor="issueDate">
                            Ngày cấp <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="issueDate"
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Expire Date */}
                    <div className="space-y-2">
                        <Label htmlFor="expireDate">
                            Ngày hết hạn {licenseType === 'FOOD_SAFETY_CERT' && <span className="text-red-500">*</span>}
                            {licenseType === 'BUSINESS_REGISTRATION' && <span className="text-gray-500 text-xs">(không bắt buộc)</span>}
                        </Label>
                        <Input
                            id="expireDate"
                            type="date"
                            value={expireDate}
                            onChange={(e) => setExpireDate(e.target.value)}
                            disabled={isLoading || (licenseType === 'FOOD_SAFETY_CERT' && !isEditing)}
                            className={licenseType === 'FOOD_SAFETY_CERT' && !isEditing ? 'bg-gray-100' : ''}
                        />
                        {licenseType === 'FOOD_SAFETY_CERT' && !isEditing && (
                            <p className="text-xs text-blue-600">
                                Tự động tính: 3 năm sau ngày cấp
                            </p>
                        )}
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="document">
                            File giấy phép <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-2">
                            {documentFile ? (
                                <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                                    <File className="w-5 h-5 text-blue-500" />
                                    <span className="flex-1 text-sm truncate">{documentFile.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveFile}
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : documentUrl ? (
                                <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                                    <File className="w-5 h-5 text-green-500" />
                                    <span className="flex-1 text-sm">Đã có file</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveFile}
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Input
                                        id="document"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                        onChange={handleFileChange}
                                        disabled={isLoading}
                                        className="cursor-pointer"
                                    />
                                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            )}
                            <p className="text-xs text-gray-500">
                                Chỉ chấp nhận file hình ảnh (JPG, PNG). Tối đa 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 pt-4">
                        {/* Delete Button - only show when editing */}
                        {isEditing && (
                            <div className="flex-1">
                                {showDeleteConfirm ? (
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                        >
                                            Xác nhận xóa
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={isLoading}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={isLoading}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa giấy phép
                                    </Button>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 ml-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false)
                                    resetForm()
                                }}
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isUploading ? 'Đang tải lên...' : deleteMutation.isPending ? 'Đang xóa...' : 'Đang lưu...'}
                                    </>
                                ) : (
                                    <>{isEditing ? 'Cập nhật' : 'Tạo giấy phép'}</>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
