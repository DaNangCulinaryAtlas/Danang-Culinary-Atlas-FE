"use client"

import { useState } from "react"
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

// Mock data
const reports = [
  {
    id: 1,
    reporter: "User A",
    reporterId: 1,
    targetType: "Quán ăn",
    targetId: 1,
    targetName: "Quán Bún Bò",
    reason: "Thông tin sai lệch",
    time: "2024-03-15 10:30",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    reporter: "User B",
    reporterId: 2,
    targetType: "Bình luận",
    targetId: 5,
    targetName: "Bình luận thô tục",
    reason: "Nội dung không phù hợp",
    time: "2024-03-14 15:20",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    reporter: "User C",
    reporterId: 3,
    targetType: "Món ăn",
    targetId: 3,
    targetName: "Phở Bò",
    reason: "Hình ảnh không đúng",
    time: "2024-03-13 09:15",
    status: "resolved",
    priority: "low",
  },
]

export default function ReportHandling() {
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const handleDismiss = (id: number) => {
    // TODO: API call to dismiss report
    console.log("Dismiss report:", id)
  }

  const handleDeleteContent = (id: number) => {
    // TODO: API call to delete content
    console.log("Delete content for report:", id)
  }

  const handleBanUser = (id: number) => {
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
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="resolved">Đã xử lý</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Báo cáo</CardTitle>
          <CardDescription>
            Tổng số: {reports.length} báo cáo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Đối tượng</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow
                  key={report.id}
                  className={
                    report.priority === "high" && report.status === "pending"
                      ? "bg-red-50 dark:bg-red-950"
                      : ""
                  }
                >
                  <TableCell>{report.id}</TableCell>
                  <TableCell className="font-medium">
                    {report.reporter}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.targetType}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.targetName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "pending" ? "pending" : "approved"
                      }
                    >
                      {report.status === "pending" ? "Chờ xử lý" : "Đã xử lý"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Xử lý Báo cáo</DialogTitle>
                          <DialogDescription>
                            ID: {report.id} - {report.targetType}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Thông tin báo cáo</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Người báo cáo:</span>{" "}
                                {report.reporter}
                              </div>
                              <div>
                                <span className="font-medium">Đối tượng:</span>{" "}
                                {report.targetType} - {report.targetName}
                              </div>
                              <div>
                                <span className="font-medium">Lý do:</span>{" "}
                                {report.reason}
                              </div>
                              <div>
                                <span className="font-medium">Thời gian:</span>{" "}
                                {report.time}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Nội dung bị báo cáo</h3>
                            <div className="border rounded-md p-4 bg-muted">
                              {report.targetType === "Bình luận" ? (
                                <p className="text-sm">
                                  "Đây là nội dung bình luận bị báo cáo..."
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  [Hiển thị nội dung {report.targetType.toLowerCase()}]
                                </p>
                              )}
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
        </CardContent>
      </Card>
    </div>
  )
}

