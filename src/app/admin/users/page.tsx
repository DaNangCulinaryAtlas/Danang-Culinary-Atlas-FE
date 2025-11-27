"use client"

import { useState } from "react"
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
import { Search, Eye, Lock, Unlock, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"

// Mock data
const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "User",
    status: "Active",
    avatar: null,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "Vendor",
    status: "Active",
    avatar: null,
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "User",
    status: "Blocked",
    avatar: null,
    joinDate: "2024-03-10",
  },
]

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const handleSendEmail = async () => {
    if (!selectedUser || !emailSubject.trim() || !emailContent.trim()) {
      return
    }

    setIsSendingEmail(true)
    try {
      // TODO: API call to send email
      // await sendEmailToUser(selectedUser.id, {
      //   to: selectedUser.email,
      //   subject: emailSubject,
      //   content: emailContent
      // })
      
      console.log("Sending email to:", selectedUser.email)
      console.log("Subject:", emailSubject)
      console.log("Content:", emailContent)
      
      // Reset form
      setEmailSubject("")
      setEmailContent("")
      setSelectedUser(null)
      
      // TODO: Show success toast
      alert("Email đã được gửi thành công!")
    } catch (error) {
      console.error("Error sending email:", error)
      // TODO: Show error toast
      alert("Có lỗi xảy ra khi gửi email!")
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="space-y-6">
      <div 
        className="rounded-xl p-5 md:p-6 text-white shadow-lg"
        style={{ background: adminColors.gradients.primary }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Người dùng</h1>
        <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
          Quản lý tài khoản User, Vendor và Admin
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email hoặc số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[160px] h-9">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px] h-9">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
        <CardHeader 
          className="text-white"
          style={{ background: adminColors.gradients.primary }}
        >
          <CardTitle className="text-white text-xl font-bold">Danh sách Người dùng</CardTitle>
          <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
            Tổng số: {users.length} người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active" ? "success" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
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
                            <DialogTitle>Chi tiết Người dùng</DialogTitle>
                            <DialogDescription>
                              Thông tin chi tiết từ UserProfile/VendorProfile
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>ID: {user.id}</p>
                            <p>Tên: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Vai trò: {user.role}</p>
                            <p>Trạng thái: {user.status}</p>
                            <div>
                              <h3 className="font-semibold mb-2">Lịch sử hoạt động:</h3>
                              <p className="text-sm text-muted-foreground">
                                Các quán đã đăng, các đánh giá đã viết...
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={user.status === "Active" ? "Khóa" : "Mở khóa"}
                      >
                        {user.status === "Active" ? (
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
                            onClick={() => setSelectedUser(user)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Gửi Email</DialogTitle>
                            <DialogDescription>
                              Gửi email tới: <span className="font-semibold text-foreground">{user.email}</span>
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
                                className="w-full"
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
                                className="w-full resize-none"
                              />
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Người nhận:</span> {user.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Tên:</span> {user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Vai trò:</span> {user.role}
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEmailSubject("")
                                setEmailContent("")
                                setSelectedUser(null)
                              }}
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleSendEmail}
                              disabled={!emailSubject.trim() || !emailContent.trim() || isSendingEmail}
                              style={{
                                background: adminColors.gradients.primarySoft
                              }}
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
        </CardContent>
      </Card>
    </div>
  )
}

