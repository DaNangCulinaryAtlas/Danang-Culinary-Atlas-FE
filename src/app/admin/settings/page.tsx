"use client"

import { useEffect, useState } from "react"
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
import { Plus, Edit, Trash2, MapPin, Tag, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { BASE_URL, API_ENDPOINTS } from "@/configs/api"

interface Province {
  id: number
  name: string
}

interface District {
  id: number
  name: string
  provinceId: number
}

interface Ward {
  id: number
  name: string
  districtId: number
}

interface TagItem {
  id: number
  name: string
}

const tagColorPalette = ["#0C516F", "#14B8A6", "#F59E0B", "#EF4444", "#8B5CF6", "#0EA5E9"]

export default function SystemSettings() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [restaurantTags, setRestaurantTags] = useState<TagItem[]>([])
  const [dishTags, setDishTags] = useState<TagItem[]>([])

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [isLoadingWards, setIsLoadingWards] = useState(false)
  const [isLoadingRestaurantTags, setIsLoadingRestaurantTags] = useState(false)
  const [isLoadingDishTags, setIsLoadingDishTags] = useState(false)

  const filteredDistricts = districts
  const filteredWards = wards

  const currentProvince = selectedProvince
    ? provinces.find((province) => province.id === selectedProvince) || null
    : null

  const currentDistrict = selectedDistrict
    ? districts.find((district) => district.id === selectedDistrict) || null
    : null

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return {}
    const token = window.localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const loadProvinces = async () => {
    setIsLoadingProvinces(true)
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.PROVINCES_LIST}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      if (!response.ok) throw new Error("Failed to load provinces")
      const data = await response.json()
      const normalized: Province[] = (Array.isArray(data) ? data : data?.data || []).map((province: any) => ({
        id: province.provinceId,
        name: province.name,
      }))
      setProvinces(normalized)
      if (!selectedProvince && normalized.length > 0) {
        setSelectedProvince(normalized[0].id)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingProvinces(false)
    }
  }

  const loadDistricts = async (provinceId: number) => {
    setIsLoadingDistricts(true)
    setSelectedDistrict(null)
    setWards([])
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.DISTRICTS_BY_PROVINCE(String(provinceId))}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      if (!response.ok) throw new Error("Failed to load districts")
      const data = await response.json()
      const normalized: District[] = (Array.isArray(data) ? data : data?.data || []).map((district: any) => ({
        id: district.districtId,
        name: district.name,
        provinceId: district.provinceId,
      }))
      setDistricts(normalized)
    } catch (error) {
      console.error(error)
      setDistricts([])
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  const loadWards = async (districtId: number) => {
    setIsLoadingWards(true)
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.WARDS_BY_DISTRICT(String(districtId))}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      if (!response.ok) throw new Error("Failed to load wards")
      const data = await response.json()
      const normalized: Ward[] = (Array.isArray(data) ? data : data?.data || []).map((ward: any) => ({
        id: ward.wardId,
        name: ward.name,
        districtId: ward.districtId,
      }))
      setWards(normalized)
    } catch (error) {
      console.error(error)
      setWards([])
    } finally {
      setIsLoadingWards(false)
    }
  }

  const loadRestaurantTags = async () => {
    setIsLoadingRestaurantTags(true)
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANT_TAGS_LIST}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      if (!response.ok) throw new Error("Failed to load restaurant tags")
      const data = await response.json()
      const normalized: TagItem[] = (Array.isArray(data) ? data : data?.data || []).map((tag: any) => ({
        id: tag.tagId,
        name: tag.name,
      }))
      setRestaurantTags(normalized)
    } catch (error) {
      console.error(error)
      setRestaurantTags([])
    } finally {
      setIsLoadingRestaurantTags(false)
    }
  }

  const loadDishTags = async () => {
    setIsLoadingDishTags(true)
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.DISH_TAGS_LIST}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
      if (!response.ok) throw new Error("Failed to load dish tags")
      const data = await response.json()
      const normalized: TagItem[] = (Array.isArray(data) ? data : data?.data || []).map((tag: any) => ({
        id: tag.tagId,
        name: tag.name,
      }))
      setDishTags(normalized)
    } catch (error) {
      console.error(error)
      setDishTags([])
    } finally {
      setIsLoadingDishTags(false)
    }
  }

  useEffect(() => {
    loadProvinces()
    loadRestaurantTags()
    loadDishTags()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince)
    } else {
      setDistricts([])
      setSelectedDistrict(null)
      setWards([])
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict)
    } else {
      setWards([])
    }
  }, [selectedDistrict])

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
                {isLoadingProvinces ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải danh sách tỉnh/thành phố...
                  </div>
                ) : provinces.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Chưa có dữ liệu tỉnh/thành phố.
                  </div>
                ) : (
                  provinces.map((province) => {
                    const isActive = province.id === selectedProvince
                    return (
                      <div
                        key={province.id}
                        className={`rounded-lg border p-3 transition hover:border-primary/60 hover:bg-primary/5 ${isActive ? "border-primary bg-primary/5" : "border-muted"
                          }`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex w-full items-center justify-between text-left"
                          onClick={() => {
                            setSelectedProvince(province.id)
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              setSelectedProvince(province.id)
                            }
                          }}
                        >
                          <div>
                            <p className="font-semibold">{province.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {province.id}</p>
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
                  })
                )}
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
                ) : isLoadingDistricts ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải quận/huyện...
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
                          className={`rounded-lg border p-3 transition hover:border-primary/60 hover:bg-primary/5 ${isActive ? "border-primary bg-primary/5" : "border-muted"
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
                ) : isLoadingWards ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải phường/xã...
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
              {isLoadingRestaurantTags ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải restaurant tags...
                </div>
              ) : restaurantTags.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Chưa có tag nào. Hãy thêm mới.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {restaurantTags.map((tag, index) => {
                    const color = tagColorPalette[index % tagColorPalette.length]
                    return (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div>
                            <span className="font-medium">{tag.name}</span>
                            <p className="text-xs text-muted-foreground">ID: {tag.id}</p>
                          </div>
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
                    )
                  })}
                </div>
              )}
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
              {isLoadingDishTags ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải dish tags...
                </div>
              ) : dishTags.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Chưa có tag nào. Hãy thêm mới.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dishTags.map((tag, index) => {
                    const color = tagColorPalette[(index + 2) % tagColorPalette.length]
                    return (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div>
                            <span className="font-medium">{tag.name}</span>
                            <p className="text-xs text-muted-foreground">ID: {tag.id}</p>
                          </div>
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
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

