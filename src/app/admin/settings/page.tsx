"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, MapPin, Tag } from "lucide-react"
import { Label } from "@/components/ui/label"

// Mock data
const provinces = [
  { id: 1, name: "Đà Nẵng", code: "DN" },
  { id: 2, name: "Hà Nội", code: "HN" },
]

const districts = [
  { id: 1, name: "Quận 1", provinceId: 1 },
  { id: 2, name: "Quận 2", provinceId: 1 },
]

const wards = [
  { id: 1, name: "Phường 1", districtId: 1 },
  { id: 2, name: "Phường 2", districtId: 1 },
]

const restaurantTags = [
  { id: 1, name: "Sang trọng", color: "#FF6B6B" },
  { id: 2, name: "Vỉa hè", color: "#4ECDC4" },
  { id: 3, name: "Gia đình", color: "#FFE66D" },
]

const dishTags = [
  { id: 1, name: "Hải sản", color: "#95E1D3" },
  { id: 2, name: "Bún", color: "#F38181" },
  { id: 3, name: "Mì", color: "#AA96DA" },
  { id: 4, name: "Cay", color: "#FF6B6B" },
]

export default function SystemSettings() {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
        <p className="text-muted-foreground">
          Quản lý danh mục và cấu hình hệ thống
        </p>
      </div>

      <Tabs defaultValue="location" className="space-y-4">
        <TabsList>
          <TabsTrigger value="location">
            <MapPin className="mr-2 h-4 w-4" />
            Địa chính
          </TabsTrigger>
          <TabsTrigger value="restaurant-tags">
            <Tag className="mr-2 h-4 w-4" />
            Restaurant Tags
          </TabsTrigger>
          <TabsTrigger value="dish-tags">
            <Tag className="mr-2 h-4 w-4" />
            Dish Tags
          </TabsTrigger>
        </TabsList>

        {/* Location Management */}
        <TabsContent value="location" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Provinces */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tỉnh/Thành phố</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm Tỉnh/Thành phố</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Tên</Label>
                          <Input placeholder="Nhập tên tỉnh/thành phố" />
                        </div>
                        <div>
                          <Label>Mã</Label>
                          <Input placeholder="Nhập mã" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Thêm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provinces.map((province) => (
                      <TableRow key={province.id}>
                        <TableCell>{province.name}</TableCell>
                        <TableCell>{province.code}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Districts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quận/Huyện</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm Quận/Huyện</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Tên</Label>
                          <Input placeholder="Nhập tên quận/huyện" />
                        </div>
                        <div>
                          <Label>Tỉnh/Thành phố</Label>
                          <Input placeholder="Chọn tỉnh/thành phố" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Thêm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {districts.map((district) => (
                      <TableRow key={district.id}>
                        <TableCell>{district.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Wards */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Phường/Xã</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm Phường/Xã</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Tên</Label>
                          <Input placeholder="Nhập tên phường/xã" />
                        </div>
                        <div>
                          <Label>Quận/Huyện</Label>
                          <Input placeholder="Chọn quận/huyện" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Thêm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wards.map((ward) => (
                      <TableRow key={ward.id}>
                        <TableCell>{ward.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
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
        </TabsContent>

        {/* Restaurant Tags */}
        <TabsContent value="restaurant-tags" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Restaurant Tags</CardTitle>
                  <CardDescription>
                    Quản lý nhãn phân loại quán ăn
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Restaurant Tag</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Tên</Label>
                        <Input placeholder="Nhập tên tag" />
                      </div>
                      <div>
                        <Label>Màu sắc</Label>
                        <Input type="color" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Thêm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {restaurantTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dish Tags */}
        <TabsContent value="dish-tags" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dish Tags</CardTitle>
                  <CardDescription>
                    Quản lý nhãn phân loại món ăn
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Dish Tag</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Tên</Label>
                        <Input placeholder="Nhập tên tag" />
                      </div>
                      <div>
                        <Label>Màu sắc</Label>
                        <Input type="color" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Thêm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dishTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

