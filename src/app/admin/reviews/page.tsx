"use client"

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
import { Eye, Check, X } from "lucide-react"

// Mock data
const reviews = [
  {
    id: 1,
    user: "User A",
    restaurant: "Quán Bún Bò",
    rating: 5,
    comment: "Quán rất ngon, phục vụ tốt!",
    date: "2024-03-15",
    status: "Approved",
  },
  {
    id: 2,
    user: "User B",
    restaurant: "Nhà hàng Hải Sản",
    rating: 4,
    comment: "Đồ ăn ngon nhưng hơi đắt",
    date: "2024-03-14",
    status: "Pending",
  },
  {
    id: 3,
    user: "User C",
    restaurant: "Cafe Sáng",
    rating: 1,
    comment: "Chất lượng kém, không đúng như quảng cáo",
    date: "2024-03-13",
    status: "Pending",
  },
]

export default function ReviewModeration() {
  const handleApprove = (id: number) => {
    // TODO: API call to approve review
    console.log("Approve review:", id)
  }

  const handleReject = (id: number) => {
    // TODO: API call to reject review
    console.log("Reject review:", id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kiểm duyệt Đánh giá</h1>
        <p className="text-muted-foreground">
          Quản lý và kiểm duyệt các đánh giá từ người dùng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Đánh giá</CardTitle>
          <CardDescription>
            Tổng số: {reviews.length} đánh giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Quán ăn</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Bình luận</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell className="font-medium">{review.user}</TableCell>
                  <TableCell>{review.restaurant}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.comment}
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.status === "Approved" ? "approved" : "pending"
                      }
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chi tiết Đánh giá</DialogTitle>
                            <DialogDescription>ID: {review.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <span className="font-medium">Người dùng:</span>{" "}
                              {review.user}
                            </div>
                            <div>
                              <span className="font-medium">Quán ăn:</span>{" "}
                              {review.restaurant}
                            </div>
                            <div>
                              <span className="font-medium">Đánh giá:</span>{" "}
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </div>
                            <div>
                              <span className="font-medium">Bình luận:</span>
                              <p className="mt-2 p-3 bg-muted rounded-md">
                                {review.comment}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Ngày:</span>{" "}
                              {review.date}
                            </div>
                          </div>
                          {review.status === "Pending" && (
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => handleReject(review.id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Từ chối
                              </Button>
                              <Button
                                onClick={() => handleApprove(review.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Duyệt
                              </Button>
                            </DialogFooter>
                          )}
                        </DialogContent>
                      </Dialog>
                      {review.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(review.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(review.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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

