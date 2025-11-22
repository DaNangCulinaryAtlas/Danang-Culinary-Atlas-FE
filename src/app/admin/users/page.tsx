"use client"

import { useState } from "react"
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
import { Search, Eye, Lock, Unlock, UserCog } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  return (
    <div className="space-y-6">
      <div 
        className="rounded-2xl p-8 text-white shadow-2xl"
        style={{ background: adminColors.gradients.primary }}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">Quản lý Người dùng</h1>
        <p className="text-lg font-medium" style={{ color: adminColors.primary[200] }}>
          Quản lý tài khoản User, Vendor và Admin
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="border-2 shadow-lg bg-white" style={{ borderColor: adminColors.primary[200] }}>
        <CardHeader 
          className="border-b"
          style={{ 
            background: `linear-gradient(to right, ${adminColors.primary[50]}, rgba(230, 244, 248, 0.5), white)`,
            borderColor: adminColors.primary[200]
          }}
        >
          <CardTitle className="font-bold" style={{ color: adminColors.primary[600] }}>
            Bộ lọc và Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
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
              <SelectTrigger className="w-full md:w-[180px]">
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
              <SelectTrigger className="w-full md:w-[180px]">
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
                      <Button variant="ghost" size="icon" title="Phân quyền">
                        <UserCog className="h-4 w-4" />
                      </Button>
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

