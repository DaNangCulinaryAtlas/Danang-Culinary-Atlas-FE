"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, Lock, Unlock, Mail, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useAccounts } from "./hooks/useAccounts"
import { useAccountActions } from "./hooks/useAccountActions"
import { formatDate, isValidImageUrl, displayStatus, displayRole } from "./utils/accountUtils"
import Toast from "./components/Toast"
import EmailDialog from "./components/EmailDialog"
import BlockConfirmDialog from "./components/BlockConfirmDialog"
import type { AccountItem } from "./types"

export default function UserVendorManagement() {
  const [isMounted, setIsMounted] = useState(false)
  const [accountType, setAccountType] = useState<"USER" | "VENDOR">("USER")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null)
  const [confirmAccount, setConfirmAccount] = useState<AccountItem | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const { accounts, isLoading, error, totalAccounts, refetch } = useAccounts(accountType, statusFilter)
  const { updateAccountStatus, sendEmail, updatingAccountId, isSendingEmail } = useAccountActions(refetch)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [accountType, statusFilter, searchQuery])

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredAccounts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    if (!keyword) return accounts
    return accounts.filter((account) => {
      const name = account.name?.toLowerCase() || ""
      const email = account.email?.toLowerCase() || ""
      return name.includes(keyword) || email.includes(keyword)
    })
  }, [accounts, searchQuery])

  const paginatedAccounts = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredAccounts.slice(start, start + pageSize)
  }, [filteredAccounts, page, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize) || 1)

  const handleUpdateStatus = async (account: AccountItem) => {
    const nextStatus = account.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
    if (nextStatus === "BLOCKED") {
      setConfirmAccount(account)
      return
    }
    const result = await updateAccountStatus(account, nextStatus)
    showToast(result.success ? "success" : "error", result.message)
  }

  const handleConfirmBlock = async () => {
    if (!confirmAccount) return
    const result = await updateAccountStatus(confirmAccount, "BLOCKED")
    showToast(result.success ? "success" : "error", result.message)
    setConfirmAccount(null)
  }

  const handleSendEmail = async (accountId: string, subject: string, content: string) => {
    const result = await sendEmail(accountId, subject, content)
    showToast(result.success ? "success" : "error", result.message)
    return result
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý User & Vendor</h1>
        <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
          Theo dõi và điều phối tài khoản người dùng, vendor trong hệ thống
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["USER", "VENDOR"] as const).map((type) => (
          <Button
            key={type}
            variant={accountType === type ? "default" : "outline"}
            onClick={() => setAccountType(type)}
            className="text-sm"
          >
            {type === "USER" ? "User" : "Vendor"}
          </Button>
        ))}
      </div>

      <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px] h-9">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
        <CardHeader className="text-white" style={{ background: adminColors.gradients.primary }}>
          <CardTitle className="text-white text-xl font-bold">
            Danh sách {accountType === "USER" ? "User" : "Vendor"}
          </CardTitle>
          <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
            {error
              ? error
              : `Tổng: ${totalAccounts} tài khoản${searchQuery.trim() ? ` · Kết quả phù hợp: ${filteredAccounts.length}` : ""
              }`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Không tìm thấy tài khoản phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-semibold text-gray-600">{account.id}</TableCell>
                      <TableCell>
                        {isValidImageUrl(account.avatarUrl) ? (
                          <Image
                            src={account.avatarUrl as string}
                            alt={account.name}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-500">
                            {account.name.charAt(0)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{account.name}</div>
                        {account.vendorName && (
                          <p className="text-xs text-muted-foreground">{account.vendorName}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{account.email}</div>
                        {account.phone && <p className="text-xs text-muted-foreground">{account.phone}</p>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{displayRole(account.role)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={account.status === "ACTIVE" ? "success" : "destructive"}>
                          {displayStatus(account.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(account.joinedAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chi tiết tài khoản</DialogTitle>
                                <DialogDescription>ID: {account.id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 text-sm">
                                <p>
                                  <strong>Họ tên:</strong> {account.name}
                                </p>
                                <p>
                                  <strong>Email:</strong> {account.email}
                                </p>
                                {account.phone && (
                                  <p>
                                    <strong>Số điện thoại:</strong> {account.phone}
                                  </p>
                                )}
                                <p>
                                  <strong>Vai trò:</strong> {displayRole(account.role)}
                                </p>
                                <p>
                                  <strong>Trạng thái:</strong> {displayStatus(account.status)}
                                </p>
                                <p>
                                  <strong>Ngày tham gia:</strong> {formatDate(account.joinedAt)}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={account.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
                            onClick={() => handleUpdateStatus(account)}
                            disabled={updatingAccountId === account.id}
                          >
                            {updatingAccountId === account.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : account.status === "ACTIVE" ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Gửi email"
                            onClick={() => setSelectedAccount(account)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Số dòng" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / trang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Hiển thị {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, filteredAccounts.length)} trong tổng {filteredAccounts.length}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center md:justify-end">
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* First page button */}
            {page > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                >
                  1
                </Button>
                {page > 4 && (
                  <span className="flex items-center px-2">...</span>
                )}
              </>
            )}

            {/* Page numbers around current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
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
                  {pageNum}
                </Button>
              ))}

            {/* Last page button */}
            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && (
                  <span className="flex items-center px-2">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}

            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || isLoading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <EmailDialog
        account={selectedAccount}
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        onSend={handleSendEmail}
        isSending={isSendingEmail}
      />

      <BlockConfirmDialog
        account={confirmAccount}
        isOpen={!!confirmAccount}
        onClose={() => setConfirmAccount(null)}
        onConfirm={handleConfirmBlock}
        isUpdating={!!updatingAccountId && updatingAccountId === confirmAccount?.id}
      />
    </div>
  )
}
