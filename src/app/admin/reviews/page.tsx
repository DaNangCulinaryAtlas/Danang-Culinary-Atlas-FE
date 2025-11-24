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
import { Eye, EyeOff, Check, X } from "lucide-react"

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

  const [hiddenReviews, setHiddenReviews] = useState<number[]>([])

  const toggleVisibility = (id: number) => {
    setHiddenReviews((prev) =>
      prev.includes(id) ? prev.filter((reviewId) => reviewId !== id) : [...prev, id]
    )
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
        <CardContent className="space-y-2.5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`flex flex-col gap-2 rounded-lg border bg-gradient-to-r from-[rgba(12,81,111,0.07)] via-white to-white p-3 shadow-sm transition hover:border-primary/40 hover:shadow-md ${
                hiddenReviews.includes(review.id) ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                <Badge variant="outline" className="text-[10px]">
                  #{review.id}
                </Badge>
                <span className="font-semibold text-primary-foreground">{review.user}</span>
                <span className="text-muted-foreground">đánh giá</span>
                <span className="font-medium text-primary">{review.restaurant}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  {"★".repeat(review.rating)}
                  <span className="text-muted-foreground">{review.rating}/5</span>
                </div>
                <span className="text-muted-foreground text-xs">{review.date}</span>
                {hiddenReviews.includes(review.id) && (
                  <Badge variant="secondary" className="text-[10px]">
                    Đang ẩn
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p className="flex-1 truncate text-sm text-muted-foreground">
                  {review.comment}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 border-none bg-gradient-to-r from-[#0C516F] via-[#127697] to-[#2AA6C3] text-white shadow-sm hover:opacity-90"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Chi tiết Đánh giá #{review.id}</DialogTitle>
                        <DialogDescription>
                          Người dùng {review.user} đánh giá {review.restaurant}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Người dùng:</span>
                          <span>{review.user}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Quán ăn:</span>
                          <span>{review.restaurant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Đánh giá:</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            {"★".repeat(review.rating)}
                            <span className="text-xs text-muted-foreground">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Bình luận:</span>
                          <p className="mt-2 rounded-md bg-muted p-3 text-sm leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Ngày gửi:</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                      <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <Button
                          variant="secondary"
                          onClick={() => toggleVisibility(review.id)}
                          className="flex-1"
                        >
                          {hiddenReviews.includes(review.id) ? (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Hiện đánh giá
                            </>
                          ) : (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Ẩn đánh giá
                            </>
                          )}
                        </Button>
                        <div className="flex flex-1 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleReject(review.id)}
                            className="flex-1"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Từ chối
                          </Button>
                          <Button
                            onClick={() => handleApprove(review.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Duyệt
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    onClick={() => toggleVisibility(review.id)}
                    className="h-8 border-none bg-gradient-to-r from-[#0C516F0D] to-[#2AA6C30D] text-primary transition hover:from-[#0C516F22] hover:to-[#2AA6C322]"
                  >
                    {hiddenReviews.includes(review.id) ? (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Hiện đánh giá
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Ẩn đánh giá
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

