"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Check, X, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"

// Mock data
const dishes = [
  {
    id: 1,
    name: "Bún Bò Huế",
    price: "45000",
    restaurant: "Quán Bún Bò Huế",
    restaurantId: 1,
    image: null,
    tags: ["Cay", "Mặn"],
    status: "Pending",
  },
  {
    id: 2,
    name: "Phở Bò",
    price: "50000",
    restaurant: "Nhà hàng Phở",
    restaurantId: 2,
    image: null,
    tags: ["Mặn"],
    status: "Approved",
  },
  {
    id: 3,
    name: "Bánh Mì Chay",
    price: "25000",
    restaurant: "Quán Chay",
    restaurantId: 3,
    image: null,
    tags: ["Chay"],
    status: "Rejected",
  },
  {
    id: 4,
    name: "Cơm Gà",
    price: "55000",
    restaurant: "Quán Cơm",
    restaurantId: 4,
    image: null,
    tags: ["Mặn"],
    status: "Pending",
  },
]

export default function DishManagement() {
  const [selectedDishes, setSelectedDishes] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleDishSelection = (id: number) => {
    setSelectedDishes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const handleBulkApprove = () => {
    // TODO: API call to approve multiple dishes
    console.log("Approve dishes:", selectedDishes)
    setSelectedDishes([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="pending">Pending</Badge>
      case "Approved":
        return <Badge variant="approved">Approved</Badge>
      case "Rejected":
        return <Badge variant="rejected">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Món ăn</h1>
        <p className="text-muted-foreground">
          Kiểm duyệt và quản lý món ăn trong hệ thống
        </p>
      </div>

      {/* Search and Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc và Hành động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {selectedDishes.length > 0 && (
              <Button onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Duyệt nhanh ({selectedDishes.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dishes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  [Hình ảnh món ăn]
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Checkbox
                  checked={selectedDishes.includes(dish.id)}
                  onCheckedChange={() => toggleDishSelection(dish.id)}
                  className="bg-background"
                />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{dish.name}</CardTitle>
              <CardDescription>
                <Link
                  href={`/restaurants/${dish.restaurantId}`}
                  className="hover:underline"
                >
                  {dish.restaurant}
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {parseInt(dish.price).toLocaleString("vi-VN")} đ
                  </span>
                  {getStatusBadge(dish.status)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {dish.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{dish.name}</DialogTitle>
                        <DialogDescription>
                          Thông tin chi tiết món ăn
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Mô tả</h3>
                          <p className="text-sm text-muted-foreground">
                            Món ăn đặc sản với hương vị đậm đà...
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Giá</h3>
                          <p className="text-lg font-bold">
                            {parseInt(dish.price).toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {dish.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Quán ăn</h3>
                          <Link
                            href={`/restaurants/${dish.restaurantId}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {dish.restaurant}
                          </Link>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {dish.status === "Pending" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Duyệt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

