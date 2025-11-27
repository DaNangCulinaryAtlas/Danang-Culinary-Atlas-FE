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
  { id: 3, name: "Hồ Chí Minh", code: "HCM" },
]

const districts = [
  { id: 1, name: "Quận Hải Châu", provinceId: 1 },
  { id: 2, name: "Quận Sơn Trà", provinceId: 1 },
  { id: 3, name: "Quận Hoàn Kiếm", provinceId: 2 },
  { id: 4, name: "Quận Ba Đình", provinceId: 2 },
  { id: 5, name: "Quận 1", provinceId: 3 },
]

const wards = [
  { id: 1, name: "Phường Thạch Thang", districtId: 1 },
  { id: 2, name: "Phường Thuận Phước", districtId: 1 },
  { id: 3, name: "Phường Phước Mỹ", districtId: 2 },
  { id: 4, name: "Phường Tràng Tiền", districtId: 3 },
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
  const [selectedProvince, setSelectedProvince] = useState<number | null>(provinces[0]?.id ?? null)
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)

  const filteredDistricts = selectedProvince
    ? districts.filter((district) => district.provinceId === selectedProvince)
    : []

  const filteredWards = selectedDistrict
    ? wards.filter((ward) => ward.districtId === selectedDistrict)
    : []

  const currentProvince = selectedProvince
    ? provinces.find((province) => province.id === selectedProvince)
    : null

  const currentDistrict = selectedDistrict
    ? districts.find((district) => district.id === selectedDistrict)
    : null

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
            <Card className="border border-primary/10 shadow-sm">
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
              <CardContent className="space-y-2">
                {provinces.map((province) => {
                  const isActive = province.id === selectedProvince
                  return (
                    <div
                      key={province.id}
                      className={`rounded-lg border p-3 transition hover:border-primary/60 hover:bg-primary/5 ${
                        isActive ? "border-primary bg-primary/5" : "border-muted"
                      }`}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex w-full items-center justify-between text-left"
                        onClick={() => {
                          setSelectedProvince(province.id)
                          setSelectedDistrict(null)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setSelectedProvince(province.id)
                            setSelectedDistrict(null)
                          }
                        }}
                      >
                        <div>
                          <p className="font-semibold">{province.name}</p>
                          <p className="text-xs text-muted-foreground">Mã: {province.code}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <Badge variant="secondary" className="text-[11px]">
                              Đang chọn
                            </Badge>
                          )}
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Districts */}
            <Card className="border border-primary/10 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                  <CardTitle>Quận/Huyện</CardTitle>
                    <CardDescription className="text-xs">
                      {currentProvince
                        ? `Thuộc tỉnh: ${currentProvince.name}`
                        : "Chọn tỉnh để quản lý quận/huyện"}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={!selectedProvince}>
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
                          <Input value={currentProvince?.name ?? ""} disabled />
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
                {!selectedProvince ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Vui lòng chọn tỉnh/thành phố để xem danh sách quận/huyện.
                  </div>
                ) : filteredDistricts.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Chưa có quận/huyện nào. Hãy thêm mới.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredDistricts.map((district) => {
                      const isActive = district.id === selectedDistrict
                      return (
                        <div
                          key={district.id}
                          className={`rounded-lg border p-3 transition hover:border-primary/60 hover:bg-primary/5 ${
                            isActive ? "border-primary bg-primary/5" : "border-muted"
                          }`}
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            className="flex w-full items-center justify-between text-left"
                            onClick={() => setSelectedDistrict(district.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                setSelectedDistrict(district.id)
                              }
                            }}
                          >
                            <div>
                              <p className="font-semibold">{district.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Thuộc {currentProvince?.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <Badge variant="secondary" className="text-[11px]">
                                  Đang chọn
                                </Badge>
                              )}
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wards */}
            <Card className="border border-primary/10 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                  <CardTitle>Phường/Xã</CardTitle>
                    <CardDescription className="text-xs">
                      {currentDistrict
                        ? `Thuộc quận: ${currentDistrict.name}`
                        : "Chọn quận/huyện để quản lý phường/xã"}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={!selectedDistrict}>
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
                          <Input value={currentDistrict?.name ?? ""} disabled />
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
                {!selectedDistrict ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Vui lòng chọn quận/huyện để xem danh sách phường/xã.
                  </div>
                ) : filteredWards.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Chưa có phường/xã nào. Hãy thêm mới.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredWards.map((ward) => (
                      <div
                        key={ward.id}
                        className="flex items-center justify-between rounded-lg border border-muted p-3 hover:border-primary/60 hover:bg-primary/5"
                      >
                        <div>
                          <p className="font-semibold">{ward.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Thuộc {currentDistrict?.name}
                          </p>
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
                )}
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

