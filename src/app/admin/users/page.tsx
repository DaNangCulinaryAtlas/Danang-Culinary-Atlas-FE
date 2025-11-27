"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Search, Eye, Lock, Unlock, Mail, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { BASE_URL, API_ENDPOINTS } from "@/configs/api"

interface AccountItem {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatarUrl?: string | null
  joinedAt?: string
  phone?: string
  vendorName?: string
}

const roleLabels: Record<string, string> = {
  USER: "User",
  VENDOR: "Vendor",
  ADMIN: "Admin",
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  BLOCKED: "Blocked",
  DELETED: "Deleted",
}

const formatDate = (value?: string) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("vi-VN")
}

const isValidImageUrl = (value?: string | null) => {
  if (!value || typeof value !== "string") return false
  try {
    // Next/Image requires absolute URLs unless configured otherwise
    const parsed = new URL(value)
    return Boolean(parsed.protocol && parsed.host)
  } catch {
    return false
  }
}

export default function UserVendorManagement() {
  const [isMounted, setIsMounted] = useState(false)
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [accountType, setAccountType] = useState<"USER" | "VENDOR">("USER")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [updatingAccountId, setUpdatingAccountId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [confirmAccount, setConfirmAccount] = useState<AccountItem | null>(null)

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchAccounts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const endpoint =
        accountType === "VENDOR"
          ? API_ENDPOINTS.ADMIN.VENDORS_LIST
          : API_ENDPOINTS.ADMIN.USERS_LIST
      const chunkSize = 200
      let currentPage = 0
      let accumulated: AccountItem[] = []
      let totalElements = 0
      while (true) {
        const params = new URLSearchParams()
        params.set("page", String(currentPage))
        params.set("size", String(chunkSize))
        if (statusFilter !== "ALL") params.set("status", statusFilter)
        const response = await fetch(`${BASE_URL}${endpoint}?${params.toString()}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tài khoản")
        }
        const data = await response.json()
        const content = data?.data?.content || data?.data?.items || data?.data || []
        const normalized: AccountItem[] = content.map((item: any, index: number) => ({
          id: String(item.accountId ?? item.id ?? item.email ?? `${currentPage}-${index}`),
          name:
            item.fullName ||
            item.name ||
            [item.firstName, item.lastName].filter(Boolean).join(" ") ||
            item.email?.split("@")[0] ||
            "Không xác định",
          email: item.email ?? "N/A",
          role: (item.role || accountType).toUpperCase(),
          status: (item.status || "ACTIVE").toUpperCase(),
          avatarUrl: item.avatarUrl || item.avatar || null,
          joinedAt: item.createdAt || item.joinDate || item.updatedAt,
          phone: item.phoneNumber || item.phone || "",
          vendorName: item.vendorName || item.businessName || "",
        }))
        accumulated = [...accumulated, ...normalized]
        totalElements =
          data?.data?.totalElements ||
          data?.data?.total ||
          data?.meta?.total ||
          data?.totalElements ||
          accumulated.length
        if (accumulated.length >= totalElements || content.length === 0) {
          break
        }
        currentPage += 1
      }
      setAccounts(accumulated)
      setTotalAccounts(accumulated.length)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Có lỗi xảy ra")
      setAccounts([])
      setTotalAccounts(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [accountType, statusFilter, searchQuery])

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
    await submitUpdateStatus(account, nextStatus)
  }

  const submitUpdateStatus = async (account: AccountItem, nextStatus: string) => {
    setUpdatingAccountId(account.id)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.UPDATE_ACCOUNT_STATUS(account.id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái")
      }
      showToast("success", "Đã cập nhật trạng thái tài khoản")
      fetchAccounts()
    } catch (error) {
      console.error(error)
      showToast("error", "Cập nhật trạng thái thất bại")
    } finally {
      setUpdatingAccountId(null)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedAccount || !emailSubject.trim() || !emailContent.trim()) return
    setIsSendingEmail(true)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.SEND_EMAIL_TO_ACCOUNT(selectedAccount.id)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ subject: emailSubject, content: emailContent }),
      })
      if (!response.ok) {
        throw new Error("Không thể gửi email")
      }
      setEmailSubject("")
      setEmailContent("")
      setSelectedAccount(null)
      showToast("success", "Email đã được gửi thành công")
    } catch (error) {
      console.error(error)
      showToast("error", "Gửi email thất bại")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const displayStatus = (status: string) => statusLabels[status] || status
  const displayRole = (role: string) => roleLabels[role] || role

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg transition-all ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

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
              : `Tổng: ${totalAccounts} tài khoản${
                  searchQuery.trim() ? ` · Kết quả phù hợp: ${filteredAccounts.length}` : ""
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
                                <p><strong>Họ tên:</strong> {account.name}</p>
                                <p><strong>Email:</strong> {account.email}</p>
                                {account.phone && <p><strong>Số điện thoại:</strong> {account.phone}</p>}
                                <p><strong>Vai trò:</strong> {displayRole(account.role)}</p>
                                <p><strong>Trạng thái:</strong> {displayStatus(account.status)}</p>
                                <p><strong>Ngày tham gia:</strong> {formatDate(account.joinedAt)}</p>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Gửi email"
                                onClick={() => setSelectedAccount(account)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Gửi Email</DialogTitle>
                                <DialogDescription>
                                  Gửi tới: <span className="font-semibold text-foreground">{account.email}</span>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="email-subject">Tiêu đề</Label>
                                  <Input
                                    id="email-subject"
                                    placeholder="Nhập tiêu đề email..."
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email-content">Nội dung</Label>
                                  <Textarea
                                    id="email-content"
                                    placeholder="Nhập nội dung email..."
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    rows={8}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEmailSubject("")
                                    setEmailContent("")
                                    setSelectedAccount(null)
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  onClick={handleSendEmail}
                                  disabled={!emailSubject.trim() || !emailContent.trim() || isSendingEmail}
                                  style={{ background: adminColors.gradients.primarySoft }}
                                  className="text-white hover:opacity-90"
                                >
                                  {isSendingEmail ? "Đang gửi..." : "Gửi Email"}
                      </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
        <div className="text-sm text-muted-foreground">
          Trang {page} / {totalPages} — Hiển thị {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, filteredAccounts.length)} trong tổng {filteredAccounts.length}
        </div>
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || isLoading}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!confirmAccount} onOpenChange={(open) => !open && setConfirmAccount(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận khóa tài khoản</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <div>
                  Email:{" "}
                  <span className="font-semibold text-foreground">
                    {confirmAccount?.email ?? "Không xác định"}
                  </span>
                </div>
                <div>
                  Họ và tên:{" "}
                  <span className="font-semibold text-foreground">
                    {confirmAccount?.name ?? "Không xác định"}
                  </span>
                </div>
                <div>Tài khoản sẽ bị khóa và không thể đăng nhập. Bạn có chắc chắn muốn tiếp tục?</div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAccount(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmAccount) {
                  submitUpdateStatus(confirmAccount, "BLOCKED")
                  setConfirmAccount(null)
                }
              }}
              disabled={!!updatingAccountId && updatingAccountId === confirmAccount?.id}
            >
              {updatingAccountId === confirmAccount?.id ? "Đang cập nhật..." : "Khóa tài khoản"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
