"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminColors } from "@/configs/colors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, MapPin, Clock, FileText } from "lucide-react"
import Image from "next/image"

// Mock data
const pendingRestaurants = [
  {
    id: 1,
    name: "Quán Bún Bò Huế",
    address: "123 Đường ABC, Quận 1, Đà Nẵng",
    vendor: "Vendor A",
    submittedDate: "2024-03-15",
    status: "Pending",
  },
  {
    id: 2,
    name: "Nhà hàng Hải Sản",
    address: "456 Đường XYZ, Quận 2, Đà Nẵng",
    vendor: "Vendor B",
    submittedDate: "2024-03-14",
    status: "Pending",
  },
]

const activeRestaurants = [
  {
    id: 3,
    name: "Cafe Sáng",
    address: "789 Đường DEF, Quận 3, Đà Nẵng",
    vendor: "Vendor C",
    approvedDate: "2024-03-10",
    status: "Active",
  },
]

export default function RestaurantApproval() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const handleApprove = (id: number) => {
    // TODO: API call to approve restaurant
    console.log("Approve restaurant:", id)
  }

  const handleReject = () => {
    if (selectedRestaurant && rejectionReason) {
      // TODO: API call to reject restaurant with reason
      console.log("Reject restaurant:", selectedRestaurant, rejectionReason)
      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedRestaurant(null)
    }
  }

  return (
    <div className="space-y-6">
      <div 
        className="rounded-2xl p-8 text-white shadow-2xl"
        style={{ background: adminColors.gradients.primary }}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Quán ăn</h1>
        <p className="text-lg font-medium" style={{ color: adminColors.primary[200] }}>
          Kiểm duyệt và quản lý quán ăn trong hệ thống
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ duyệt <Badge variant="destructive" className="ml-2">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách chờ duyệt</CardTitle>
              <CardDescription>
                Các quán ăn đang chờ được duyệt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên quán</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>{restaurant.id}</TableCell>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>{restaurant.vendor}</TableCell>
                      <TableCell>{restaurant.submittedDate}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Chi tiết Duyệt Quán</DialogTitle>
                              <DialogDescription>
                                {restaurant.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left Column - Restaurant Info */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Thông tin quán</h3>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="font-medium">Tên quán:</span>{" "}
                                      {restaurant.name}
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 mt-0.5" />
                                      <span>
                                        <span className="font-medium">Địa chỉ:</span>{" "}
                                        {restaurant.address}
                                      </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Clock className="h-4 w-4 mt-0.5" />
                                      <span>
                                        <span className="font-medium">Giờ mở cửa:</span>{" "}
                                        08:00 - 22:00
                                      </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 mt-0.5" />
                                      <span>
                                        <span className="font-medium">Mô tả:</span>{" "}
                                        Quán ăn chuyên về bún bò Huế truyền thống
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Bản đồ</h3>
                                  <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    [Mini map - Hiển thị vị trí dựa trên kinh độ/vĩ độ]
                                  </div>
                                </div>
                              </div>

                              {/* Right Column - Images & License */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Hình ảnh quán ăn</h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                      <div
                                        key={i}
                                        className="h-32 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
                                      >
                                        Hình {i}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Giấy phép kinh doanh
                                  </h3>
                                  <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    [Ảnh scan từ bảng Business_License]
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedRestaurant(restaurant.id)
                                  setShowRejectDialog(true)
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Từ chối
                              </Button>
                              <Button
                                onClick={() => handleApprove(restaurant.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Chấp thuận
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
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đang hoạt động</CardTitle>
              <CardDescription>
                Các quán ăn đã được duyệt và đang hoạt động
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên quán</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Ngày duyệt</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>{restaurant.id}</TableCell>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>{restaurant.vendor}</TableCell>
                      <TableCell>{restaurant.approvedDate}</TableCell>
                      <TableCell>
                        <Badge variant="approved">{restaurant.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối Quán ăn</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối (rejection_reason)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setRejectionReason("")
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

