"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, X, Trash2, Ban } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BASE_URL, API_ENDPOINTS } from "@/configs/api"
import { Loader2 } from "lucide-react"

interface ReportItem {
  id: string
  reason: string
  status: string
  createdAt: string
  processedAt?: string | null
}

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xử lý",
  RESOLVED: "Đã xử lý",
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "pending"
    case "RESOLVED":
      return "approved"
    default:
      return "secondary"
  }
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`
}

export default function ReportHandling() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.REPORTS_LIST}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        throw new Error("Không thể tải danh sách báo cáo")
      }
      const data = await response.json()
      const normalized: ReportItem[] = (Array.isArray(data) ? data : data?.data || []).map((item: any) => ({
        id: item.reportId,
        reason: item.reason,
        status: item.status,
        createdAt: item.createdAt,
        processedAt: item.processedAt,
      }))
      setReports(normalized)
    } catch (error) {
      console.error(error)
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") return reports
    return reports.filter((report) => report.status === statusFilter.toUpperCase())
  }, [reports, statusFilter])

  const uniqueStatuses = useMemo(() => {
    const statuses = reports.map((report) => report.status)
    return Array.from(new Set(statuses))
  }, [reports])

  const handleDismiss = (id: string) => {
    // TODO: API call to dismiss report
    console.log("Dismiss report:", id)
  }

  const handleDeleteContent = (id: string) => {
    // TODO: API call to delete content
    console.log("Delete content for report:", id)
  }

  const handleBanUser = (id: string) => {
    // TODO: API call to ban user
    console.log("Ban user for report:", id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Báo cáo</h1>
        <p className="text-muted-foreground">
          Xử lý các báo cáo vi phạm từ người dùng
        </p>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status] || status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Báo cáo</CardTitle>
          <CardDescription>
            {statusFilter === "all"
              ? `Tổng: ${reports.length} báo cáo`
              : `Có ${filteredReports.length}/${reports.length} báo cáo ${statusLabels[statusFilter] || statusFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang tải danh sách báo cáo...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Không có báo cáo nào phù hợp với bộ lọc.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Thời gian tạo</TableHead>
                  <TableHead>Thời gian xử lý</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{formatDateTime(report.createdAt)}</TableCell>
                    <TableCell>{formatDateTime(report.processedAt)}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(report.status)}>
                        {statusLabels[report.status] || report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Xử lý Báo cáo</DialogTitle>
                            <DialogDescription>ID: {report.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold mb-2">Thông tin báo cáo</h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Lý do:</span>{" "}
                                  {report.reason}
                                </div>
                                <div>
                                  <span className="font-medium">Trạng thái:</span>{" "}
                                  {statusLabels[report.status] || report.status}
                                </div>
                                <div>
                                  <span className="font-medium">Tạo lúc:</span>{" "}
                                  {formatDateTime(report.createdAt)}
                                </div>
                                <div>
                                  <span className="font-medium">Xử lý lúc:</span>{" "}
                                  {formatDateTime(report.processedAt)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleDismiss(report.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Giữ nguyên
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteContent(report.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa nội dung
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleBanUser(report.id)}
                              className="bg-red-700 hover:bg-red-800"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Khóa tài khoản
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

