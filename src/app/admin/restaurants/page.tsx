"use client"

import { useEffect, useMemo, useState } from "react"
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
import { Check, X, MapPin, Clock, FileText, Eye, ArrowLeft, Store, User, Search, Loader2 } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { API_ENDPOINTS, BASE_URL } from "@/configs/api"

interface Restaurant {
  id: string
  ownerAccountId: string
  name: string
  address: string
  status: string
  approvalStatus: string
  createdAt?: string
  image?: string | null
  subPhotos?: string[]
  latitude?: number | null
  longitude?: number | null
  averageRating?: number | null
  totalReviews?: number | null
  wardId?: number | null
}

interface Province {
  provinceId: number
  name: string
}

interface District {
  districtId: number
  name: string
  provinceId: number
}

interface Ward {
  wardId: number
  name: string
  districtId: number
}

interface VendorInfo {
  accountId: string
  name: string
  email: string
  phone: string
}

interface VendorGroup {
  ownerAccountId: string
  name: string
  email: string
  phone: string
  restaurants: Restaurant[]
}


// Mock data
const pendingRestaurants = [
  {
    id: 1,
    name: "Quán Bún Bò Huế",
    address: "123 Đường ABC, Phường 1, Quận 1, Đà Nẵng",
    vendor: "Vendor A",
    submittedDate: "2024-03-15",
    status: "Pending",
    province: "Đà Nẵng",
    district: "Quận 1",
    ward: "Phường 1",
  },
  {
    id: 2,
    name: "Nhà hàng Hải Sản",
    address: "456 Đường XYZ, Phường 2, Quận 1, Đà Nẵng",
    vendor: "Vendor B",
    submittedDate: "2024-03-14",
    status: "Pending",
    province: "Đà Nẵng",
    district: "Quận 1",
    ward: "Phường 2",
  },
  {
    id: 9,
    name: "Quán Cơm Gà",
    address: "789 Đường DEF, Phường 3, Quận 2, Đà Nẵng",
    vendor: "Vendor C",
    submittedDate: "2024-03-13",
    status: "Pending",
    province: "Đà Nẵng",
    district: "Quận 2",
    ward: "Phường 3",
  },
]

// All active restaurants (for "Xem tất cả quán ăn" view)
const allActiveRestaurants = [
  {
    id: 3,
    name: "Cafe Sáng",
    address: "789 Đường DEF, Phường 1, Quận 3, Đà Nẵng",
    vendor: "Nguyễn Văn A",
    approvedDate: "2024-03-10",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 3",
    ward: "Phường 1",
  },
  {
    id: 4,
    name: "Quán Phở Bò",
    address: "321 Đường GHI, Phường 2, Quận 1, Đà Nẵng",
    vendor: "Nguyễn Văn A",
    approvedDate: "2024-02-15",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 1",
    ward: "Phường 2",
  },
  {
    id: 5,
    name: "Nhà hàng Hải Sản Biển",
    address: "654 Đường JKL, Phường 3, Quận 2, Đà Nẵng",
    vendor: "Nguyễn Văn A",
    approvedDate: "2024-01-20",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 2",
    ward: "Phường 3",
  },
  {
    id: 6,
    name: "Quán Bánh Mì",
    address: "987 Đường MNO, Phường 4, Quận 4, Đà Nẵng",
    vendor: "Trần Thị B",
    approvedDate: "2024-03-05",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 4",
    ward: "Phường 4",
  },
  {
    id: 7,
    name: "Cafe Chiều",
    address: "147 Đường PQR, Phường 1, Quận 5, Đà Nẵng",
    vendor: "Trần Thị B",
    approvedDate: "2024-02-28",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 5",
    ward: "Phường 1",
  },
  {
    id: 8,
    name: "Quán Chè",
    address: "258 Đường STU, Phường 2, Quận 6, Đà Nẵng",
    vendor: "Lê Văn C",
    approvedDate: "2024-03-12",
    status: "Active",
    image: null,
    province: "Đà Nẵng",
    district: "Quận 6",
    ward: "Phường 2",
  },
]

// Mock vendors with their restaurants
const vendors = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    totalRestaurants: 3,
    restaurants: [
      {
        id: 3,
        name: "Cafe Sáng",
        address: "789 Đường DEF, Quận 3, Đà Nẵng",
        approvedDate: "2024-03-10",
        status: "Active",
        image: null,
      },
      {
        id: 4,
        name: "Quán Phở Bò",
        address: "321 Đường GHI, Quận 1, Đà Nẵng",
        approvedDate: "2024-02-15",
        status: "Active",
        image: null,
      },
      {
        id: 5,
        name: "Nhà hàng Hải Sản Biển",
        address: "654 Đường JKL, Quận 2, Đà Nẵng",
        approvedDate: "2024-01-20",
        status: "Active",
        image: null,
      },
    ],
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0907654321",
    totalRestaurants: 2,
    restaurants: [
      {
        id: 6,
        name: "Quán Bánh Mì",
        address: "987 Đường MNO, Quận 4, Đà Nẵng",
        approvedDate: "2024-03-05",
        status: "Active",
        image: null,
      },
      {
        id: 7,
        name: "Cafe Chiều",
        address: "147 Đường PQR, Quận 5, Đà Nẵng",
        approvedDate: "2024-02-28",
        status: "Active",
        image: null,
      },
    ],
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0909876543",
    totalRestaurants: 1,
    restaurants: [
      {
        id: 8,
        name: "Quán Chè",
        address: "258 Đường STU, Quận 6, Đà Nẵng",
        approvedDate: "2024-03-12",
        status: "Active",
        image: null,
      },
    ],
  },
]

export default function RestaurantApproval() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vendorsById, setVendorsById] = useState<Record<string, VendorInfo>>({})
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<VendorGroup | null>(null)
  const [viewMode, setViewMode] = useState<"vendors" | "restaurants">("vendors")
  
  // Location data from API
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  
  // Search and filter states for pending restaurants
  const [pendingSearch, setPendingSearch] = useState("")
  const [pendingProvinceId, setPendingProvinceId] = useState<number | null>(null)
  const [pendingDistrictId, setPendingDistrictId] = useState<number | null>(null)
  const [pendingWardId, setPendingWardId] = useState<number | null>(null)
  
  // Search and filter states for active restaurants
  const [activeViewType, setActiveViewType] = useState<"all" | "vendor">("vendor")
  const [activeSearch, setActiveSearch] = useState("")
  const [activeProvinceId, setActiveProvinceId] = useState<number | null>(null)
  const [activeDistrictId, setActiveDistrictId] = useState<number | null>(null)
  const [activeWardId, setActiveWardId] = useState<number | null>(null)
  
  // Restaurants từ API: chia pending / active theo approvalStatus & status
  const pendingFromApi = useMemo(
    () => restaurants.filter((r) => (r.approvalStatus || "").toUpperCase() === "PENDING"),
    [restaurants]
  )

  const activeFromApi = useMemo(
    () =>
      restaurants.filter(
        (r) =>
          (r.approvalStatus || "").toUpperCase() === "APPROVED" &&
          (r.status || "").toUpperCase() === "ACTIVE"
      ),
    [restaurants]
  )

  // Filter pending restaurants (search theo tên + location)
  const filteredPendingRestaurants = useMemo(() => {
    return pendingFromApi.filter((restaurant) => {
      const matchesSearch =
        !pendingSearch || restaurant.name.toLowerCase().includes(pendingSearch.toLowerCase())
      
      // Filter by wardId
      if (pendingWardId !== null) {
        if (restaurant.wardId !== pendingWardId) return false
      } else if (pendingDistrictId !== null) {
        // Filter by district: check if restaurant's ward belongs to selected district
        const wardIdsInDistrict = wards
          .filter((w) => w.districtId === pendingDistrictId)
          .map((w) => w.wardId)
        if (!restaurant.wardId || !wardIdsInDistrict.includes(restaurant.wardId)) return false
      } else if (pendingProvinceId !== null) {
        // Filter by province: check if restaurant's ward belongs to a district in selected province
        const districtIdsInProvince = districts
          .filter((d) => d.provinceId === pendingProvinceId)
          .map((d) => d.districtId)
        const wardIdsInProvince = wards
          .filter((w) => districtIdsInProvince.includes(w.districtId))
          .map((w) => w.wardId)
        if (!restaurant.wardId || !wardIdsInProvince.includes(restaurant.wardId)) return false
      }
      
      return matchesSearch
    })
  }, [pendingFromApi, pendingSearch, pendingProvinceId, pendingDistrictId, pendingWardId, districts, wards])

  // Filter active restaurants (for "all" view)
  const filteredActiveRestaurants = useMemo(() => {
    return activeFromApi.filter((restaurant) => {
      const matchesSearch =
        !activeSearch || restaurant.name.toLowerCase().includes(activeSearch.toLowerCase())
      
      // Filter by wardId
      if (activeWardId !== null) {
        if (restaurant.wardId !== activeWardId) return false
      } else if (activeDistrictId !== null) {
        // Filter by district: check if restaurant's ward belongs to selected district
        const wardIdsInDistrict = wards
          .filter((w) => w.districtId === activeDistrictId)
          .map((w) => w.wardId)
        if (!restaurant.wardId || !wardIdsInDistrict.includes(restaurant.wardId)) return false
      } else if (activeProvinceId !== null) {
        // Filter by province: check if restaurant's ward belongs to a district in selected province
        const districtIdsInProvince = districts
          .filter((d) => d.provinceId === activeProvinceId)
          .map((d) => d.districtId)
        const wardIdsInProvince = wards
          .filter((w) => districtIdsInProvince.includes(w.districtId))
          .map((w) => w.wardId)
        if (!restaurant.wardId || !wardIdsInProvince.includes(restaurant.wardId)) return false
      }
      
      return matchesSearch
    })
  }, [activeFromApi, activeSearch, activeProvinceId, activeDistrictId, activeWardId, districts, wards])

  // Group theo vendor từ danh sách active (xem theo Vendor)
  const vendorGroups: VendorGroup[] = useMemo(() => {
    const map = new Map<string, VendorGroup>()

    activeFromApi.forEach((r) => {
      if (!r.ownerAccountId) return
      const key = r.ownerAccountId
      const vendorInfo = vendorsById[key]
      if (!map.has(key)) {
        map.set(key, {
          ownerAccountId: key,
          name: vendorInfo?.name ?? `Vendor ${key.slice(0, 6)}`,
          email: vendorInfo?.email ?? "",
          phone: vendorInfo?.phone ?? "",
          restaurants: [],
        })
      }
      map.get(key)!.restaurants.push(r)
    })

    // Nếu chưa có data thực (lúc backend chưa kết nối), fallback vào mock vendors
    if (map.size === 0) {
      vendors.forEach((v) => {
        const key = String(v.id)
        map.set(key, {
          ownerAccountId: key,
          name: v.name,
          email: v.email,
          phone: v.phone,
          restaurants: v.restaurants.map(
            (r: any): Restaurant => ({
              id: String(r.id),
              ownerAccountId: key,
              name: r.name,
              address: r.address,
              status: (r.status || "ACTIVE").toUpperCase(),
              approvalStatus: "APPROVED",
              createdAt: undefined,
              image: r.image ?? null,
              latitude: null,
              longitude: null,
              averageRating: null,
              totalReviews: null,
            })
          ),
        })
      })
    }

    return Array.from(map.values())
  }, [activeFromApi, vendorsById])
  
  // Get districts based on selected province (for pending)
  const availablePendingDistricts = useMemo(() => {
    if (pendingProvinceId === null) return []
    return districts.filter((d) => d.provinceId === pendingProvinceId)
  }, [districts, pendingProvinceId])

  // Get wards based on selected district (for pending)
  const availablePendingWards = useMemo(() => {
    if (pendingDistrictId === null) return []
    return wards.filter((w) => w.districtId === pendingDistrictId)
  }, [wards, pendingDistrictId])

  // Get districts based on selected province (for active)
  const availableActiveDistricts = useMemo(() => {
    if (activeProvinceId === null) return []
    return districts.filter((d) => d.provinceId === activeProvinceId)
  }, [districts, activeProvinceId])

  // Get wards based on selected district (for active)
  const availableActiveWards = useMemo(() => {
    if (activeDistrictId === null) return []
    return wards.filter((w) => w.districtId === activeDistrictId)
  }, [wards, activeDistrictId])

  const fetchRestaurants = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const all: Restaurant[] = []
      let page = 0
      const size = 100

      // Ví dụ: http://178.128.208.78:8081/api/v1/restaurants/admin?page=0&size=10&sortBy=createdAt&sortDirection=desc
      // RESTAURANTS_LIST: '/restaurants/admin'
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("size", String(size))
        params.set("sortBy", "createdAt")
        params.set("sortDirection", "desc")

        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANTS_LIST}?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )

        if (!response.ok) {
          throw new Error("Không thể tải danh sách quán ăn")
        }

        const data = await response.json()
        const content = data?.content || data?.data?.content || []

        const normalized: Restaurant[] = content.map((item: any) => ({
          id: item.restaurantId ?? item.id ?? "",
          ownerAccountId: item.ownerAccountId ?? "",
          name: item.name ?? "Không xác định",
          address: item.address ?? "N/A",
          status: (item.status || "").toUpperCase(),
          approvalStatus: (item.approvalStatus || "").toUpperCase(),
          createdAt: item.createdAt,
          image: item.images?.photo || null,
          subPhotos: Array.isArray(item.images?.sub_photo) ? item.images.sub_photo : [],
          latitude: item.latitude ?? null,
          longitude: item.longitude ?? null,
          averageRating: item.averageRating ?? null,
          totalReviews: item.totalReviews ?? null,
          wardId: item.wardId ?? null,
        }))

        all.push(...normalized)

        if (!Array.isArray(content) || content.length < size) {
          break
        }

        page++
      }

      setRestaurants(all)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Có lỗi xảy ra khi tải quán ăn")
      setRestaurants([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const params = new URLSearchParams()
      params.set("page", "0")
      params.set("size", "200")

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.VENDORS_LIST}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )

      if (!response.ok) {
        console.error("Không thể tải danh sách vendor")
        return
      }

      const data = await response.json()
      const content = data?.data?.content || data?.content || data?.data || []

      const map: Record<string, VendorInfo> = {}
      ;(content as any[]).forEach((item: any) => {
        const accountId = item.accountId ?? item.id
        if (!accountId) return
        map[String(accountId)] = {
          accountId: String(accountId),
          name:
            item.fullName ||
            [item.firstName, item.lastName].filter(Boolean).join(" ") ||
            item.vendorName ||
            `Vendor ${String(accountId).slice(0, 6)}`,
          email: item.email ?? "",
          phone: item.phoneNumber ?? "",
        }
      })

      setVendorsById(map)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch locations data
  const fetchProvinces = async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.PROVINCES_LIST}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        throw new Error("Không thể tải danh sách tỉnh/thành phố")
      }
      const data = await response.json()
      const provincesList = Array.isArray(data) ? data : data?.data || []
      setProvinces(provincesList)
    } catch (err) {
      console.error("Error fetching provinces:", err)
    }
  }

  const fetchDistricts = async (provinceId: number) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.DISTRICTS_BY_PROVINCE(String(provinceId))}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )
      if (!response.ok) {
        throw new Error("Không thể tải danh sách quận/huyện")
      }
      const data = await response.json()
      const districtsList = Array.isArray(data) ? data : data?.data || []
      // Merge với districts hiện tại (không ghi đè toàn bộ)
      setDistricts((prev) => {
        const existing = prev.filter((d) => d.provinceId !== provinceId)
        return [...existing, ...districtsList]
      })
    } catch (err) {
      console.error("Error fetching districts:", err)
    }
  }

  const fetchWards = async (districtId: number) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.WARDS_BY_DISTRICT(String(districtId))}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )
      if (!response.ok) {
        throw new Error("Không thể tải danh sách xã/phường")
      }
      const data = await response.json()
      const wardsList = Array.isArray(data) ? data : data?.data || []
      // Merge với wards hiện tại (không ghi đè toàn bộ)
      setWards((prev) => {
        const existing = prev.filter((w) => w.districtId !== districtId)
        return [...existing, ...wardsList]
      })
    } catch (err) {
      console.error("Error fetching wards:", err)
    }
  }

  useEffect(() => {
    fetchRestaurants()
    fetchVendors()
    fetchProvinces()
  }, [])

  // Fetch districts when province is selected (pending)
  useEffect(() => {
    if (pendingProvinceId !== null) {
      fetchDistricts(pendingProvinceId)
      setPendingDistrictId(null)
      setPendingWardId(null)
    }
  }, [pendingProvinceId])

  // Fetch wards when district is selected (pending)
  useEffect(() => {
    if (pendingDistrictId !== null) {
      fetchWards(pendingDistrictId)
      setPendingWardId(null)
    }
  }, [pendingDistrictId])

  // Fetch districts when province is selected (active)
  useEffect(() => {
    if (activeProvinceId !== null) {
      fetchDistricts(activeProvinceId)
      setActiveDistrictId(null)
      setActiveWardId(null)
    }
  }, [activeProvinceId])

  // Fetch wards when district is selected (active)
  useEffect(() => {
    if (activeDistrictId !== null) {
      fetchWards(activeDistrictId)
      setActiveWardId(null)
    }
  }, [activeDistrictId])

  const handleApprove = async (restaurant: Restaurant) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const body = {
        status: "APPROVED",
        rejectionReason: null,
      }

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANT_APPROVE(restaurant.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error("Không thể duyệt quán ăn")
      }

      await fetchRestaurants()
    } catch (error) {
      console.error(error)
    }
  }

  const handleReject = async () => {
    if (!selectedRestaurant || !rejectionReason.trim()) {
      return
    }

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const body = {
        status: "REJECTED",
        rejectionReason,
      }

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANT_APPROVE(selectedRestaurant.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error("Không thể từ chối quán ăn")
      }

      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedRestaurant(null)
      await fetchRestaurants()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-5 md:p-6 text-white shadow-lg"
        style={{ background: adminColors.gradients.primary }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Quản lý Quán ăn</h1>
        <p className="text-sm md:text-base font-medium" style={{ color: adminColors.primary[200] }}>
          Kiểm duyệt và quản lý quán ăn trong hệ thống
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ duyệt{" "}
            <Badge variant="destructive" className="ml-2">
              {pendingFromApi.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Search and Filter Card */}
          <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
            <CardContent className="p-4 md:p-5">
              <div className="space-y-3">
                {/* Search by restaurant name */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo tên quán ăn..."
                      value={pendingSearch}
                      onChange={(e) => setPendingSearch(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                
                {/* Location Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                      Tỉnh/Thành phố
                    </Label>
                    <Select 
                      value={pendingProvinceId ? String(pendingProvinceId) : "all"} 
                      onValueChange={(value) => {
                        if (value === "all") {
                          setPendingProvinceId(null)
                          setPendingDistrictId(null)
                          setPendingWardId(null)
                        } else {
                          setPendingProvinceId(Number(value))
                        }
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {provinces.map((province) => (
                          <SelectItem key={province.provinceId} value={String(province.provinceId)}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                      Quận/Huyện
                    </Label>
                    <Select 
                      value={pendingDistrictId ? String(pendingDistrictId) : "all"} 
                      onValueChange={(value) => {
                        if (value === "all") {
                          setPendingDistrictId(null)
                          setPendingWardId(null)
                        } else {
                          setPendingDistrictId(Number(value))
                        }
                      }}
                      disabled={pendingProvinceId === null}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {availablePendingDistricts.map((district) => (
                          <SelectItem key={district.districtId} value={String(district.districtId)}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                      Xã/Phường
                    </Label>
                    <Select 
                      value={pendingWardId ? String(pendingWardId) : "all"} 
                      onValueChange={(value) => {
                        if (value === "all") {
                          setPendingWardId(null)
                        } else {
                          setPendingWardId(Number(value))
                        }
                      }}
                      disabled={pendingDistrictId === null}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn xã/phường" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {availablePendingWards.map((ward) => (
                          <SelectItem key={ward.wardId} value={String(ward.wardId)}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Restaurants Table */}
          <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
            <CardHeader 
              className="text-white"
              style={{ background: adminColors.gradients.primary }}
            >
              <CardTitle className="text-white text-xl font-bold">Danh sách chờ duyệt</CardTitle>
              <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                Tổng số: {filteredPendingRestaurants.length} quán ăn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang tải danh sách quán ăn...
                </div>
              ) : error ? (
                <div className="py-8 text-center text-sm text-red-600">{error}</div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên quán</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingRestaurants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy quán ăn nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>{restaurant.id}</TableCell>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{restaurant.approvalStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        {restaurant.createdAt
                          ? new Date(restaurant.createdAt).toLocaleString()
                          : "-"}
                      </TableCell>
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
                                          Chưa có thông tin
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-4 w-4 mt-0.5" />
                                        <span>
                                          <span className="font-medium">Mô tả:</span>{" "}
                                          Thông tin mô tả đang được cập nhật
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
                                  <div className="space-y-3">
                                    <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                      {restaurant.image ? (
                                        <Image
                                          src={restaurant.image}
                                          alt={restaurant.name}
                                          width={400}
                                          height={260}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                                          <Store className="h-8 w-8 mb-1 text-gray-400" />
                                          Chưa có ảnh đại diện
                                        </div>
                                      )}
                                    </div>
                                    {restaurant.subPhotos && restaurant.subPhotos.length > 0 && (
                                      <div className="grid grid-cols-3 gap-2">
                                        {restaurant.subPhotos.slice(0, 9).map((url, index) => (
                                          <div
                                            key={index}
                                            className="relative h-20 rounded-md overflow-hidden bg-muted"
                                          >
                                            <Image
                                              src={url}
                                              alt={`${restaurant.name} - hình ${index + 1}`}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
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
                                  setSelectedRestaurant(restaurant)
                                  setShowRejectDialog(true)
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Từ chối
                              </Button>
                              <Button
                                onClick={() => handleApprove(restaurant)}
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
                    ))
                  )}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* View Type Toggle */}
          <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
            <CardContent className="p-4 md:p-5">
              <div className="flex gap-3">
                <Button
                  variant={activeViewType === "all" ? "default" : "outline"}
                  onClick={() => {
                    setActiveViewType("all")
                    setViewMode("restaurants")
                    setSelectedVendor(null)
                  }}
                  className="flex-1 font-semibold"
                  style={activeViewType === "all" ? {
                    background: adminColors.gradients.primarySoft,
                    color: 'white'
                  } : {}}
                >
                  Xem tất cả quán ăn
                </Button>
                <Button
                  variant={activeViewType === "vendor" ? "default" : "outline"}
                  onClick={() => {
                    setActiveViewType("vendor")
                    setViewMode("vendors")
                    setSelectedVendor(null)
                  }}
                  className="flex-1 font-semibold"
                  style={activeViewType === "vendor" ? {
                    background: adminColors.gradients.primarySoft,
                    color: 'white'
                  } : {}}
                >
                  Xem theo Vendor
                </Button>
              </div>
            </CardContent>
          </Card>

          {activeViewType === "all" ? (
            <div className="space-y-4">
              {/* Search and Filter Card for active restaurants */}
              <Card className="border shadow-md bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4 md:p-5">
                  <div className="space-y-3">
                    {/* Search by restaurant name */}
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Tìm kiếm theo tên quán ăn..."
                          value={activeSearch}
                          onChange={(e) => setActiveSearch(e.target.value)}
                          className="pl-9 h-9"
                        />
                      </div>
                    </div>
                    
                    {/* Location Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                          Tỉnh/Thành phố
                        </Label>
                        <Select 
                          value={activeProvinceId ? String(activeProvinceId) : "all"} 
                          onValueChange={(value) => {
                            if (value === "all") {
                              setActiveProvinceId(null)
                              setActiveDistrictId(null)
                              setActiveWardId(null)
                            } else {
                              setActiveProvinceId(Number(value))
                            }
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {provinces.map((province) => (
                              <SelectItem key={province.provinceId} value={String(province.provinceId)}>
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                          Quận/Huyện
                        </Label>
                        <Select 
                          value={activeDistrictId ? String(activeDistrictId) : "all"} 
                          onValueChange={(value) => {
                            if (value === "all") {
                              setActiveDistrictId(null)
                              setActiveWardId(null)
                            } else {
                              setActiveDistrictId(Number(value))
                            }
                          }}
                          disabled={activeProvinceId === null}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {availableActiveDistricts.map((district) => (
                              <SelectItem key={district.districtId} value={String(district.districtId)}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
                          Xã/Phường
                        </Label>
                        <Select 
                          value={activeWardId ? String(activeWardId) : "all"} 
                          onValueChange={(value) => {
                            if (value === "all") {
                              setActiveWardId(null)
                            } else {
                              setActiveWardId(Number(value))
                            }
                          }}
                          disabled={activeDistrictId === null}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn xã/phường" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {availableActiveWards.map((ward) => (
                              <SelectItem key={ward.wardId} value={String(ward.wardId)}>
                                {ward.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Restaurants Grid */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">
                    Tất cả Quán ăn đang hoạt động
                  </CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    Tổng số: {filteredActiveRestaurants.length} quán
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-10 text-muted-foreground">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang tải danh sách quán ăn...
                    </div>
                  ) : error ? (
                    <div className="py-8 text-center text-sm text-red-600">{error}</div>
                  ) : filteredActiveRestaurants.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Không tìm thấy quán ăn nào
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredActiveRestaurants.map((restaurant) => (
                        <Card
                          key={restaurant.id}
                          className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white group"
                          style={{ borderColor: adminColors.primary[200] }}
                        >
                          <CardHeader className="pb-3">
                            <div className="h-40 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                              {restaurant.image ? (
                                <Image
                                  src={restaurant.image}
                                  alt={restaurant.name}
                                  width={300}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center">
                                  <Store className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                  <p className="text-xs text-gray-400">Chưa có hình ảnh</p>
                                </div>
                              )}
                            </div>
                            <CardTitle className="text-lg font-bold truncate" style={{ color: adminColors.primary[700] }}>
                        {restaurant.name}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-2">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {restaurant.address}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500">Trạng thái:</p>
                                <p className="text-sm font-medium">{restaurant.status}</p>
                              </div>
                              <Badge variant="approved">Hoạt động</Badge>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="w-full font-semibold"
                                  style={{
                                    background: adminColors.gradients.primarySoft,
                                    color: 'white'
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Chi tiết Quán ăn</DialogTitle>
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
                                          Chưa có thông tin
                                        </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <FileText className="h-4 w-4 mt-0.5" />
                                          <span>
                                          <span className="font-medium">Mô tả:</span>{" "}
                                          Thông tin mô tả đang được cập nhật
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

                                  {/* Right Column - Images */}
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Hình ảnh quán ăn</h3>
                                      <div className="space-y-3">
                                        <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                          {restaurant.image ? (
                                            <Image
                                              src={restaurant.image}
                                              alt={restaurant.name}
                                              width={400}
                                              height={260}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                                              <Store className="h-8 w-8 mb-1 text-gray-400" />
                                              Chưa có ảnh đại diện
                                            </div>
                                          )}
                                        </div>
                                        {restaurant.subPhotos && restaurant.subPhotos.length > 0 && (
                                          <div className="grid grid-cols-3 gap-2">
                                            {restaurant.subPhotos.slice(0, 9).map((url, index) => (
                                              <div
                                                key={index}
                                                className="relative h-20 rounded-md overflow-hidden bg-muted"
                                              >
                                                <Image
                                                  src={url}
                                                  alt={`${restaurant.name} - hình ${index + 1}`}
                                                  fill
                                                  className="object-cover"
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : viewMode === "vendors" ? (
            <Card className="border-2 shadow-xl bg-white" style={{ borderColor: adminColors.primary[200] }}>
              <CardHeader 
                className="text-white"
                style={{ background: adminColors.gradients.primary }}
              >
                <CardTitle className="text-white text-xl font-bold">Danh sách Vendor</CardTitle>
                <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                  Tổng số: {vendorGroups.length} vendor đang hoạt động
                </CardDescription>
              </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vendorGroups.map((vendor) => (
                    <Card
                      key={vendor.ownerAccountId}
                      className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-white"
                      style={{ borderColor: adminColors.primary[200] }}
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setViewMode("restaurants")
                      }}
                    >
                      <CardHeader 
                        className="pb-3"
                        style={{ 
                          background: `linear-gradient(135deg, ${adminColors.primary[50]}, rgba(230, 244, 248, 0.3))`,
                          borderBottom: `2px solid ${adminColors.primary[200]}`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ring-2 transition-transform group-hover:scale-110"
                            style={{ 
                              background: adminColors.gradients.primarySoft,
                              ["--tw-ring-color" as string]: adminColors.primary[200],
                            }}
                          >
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-bold truncate" style={{ color: adminColors.primary[700] }}>
                              {vendor.name}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium truncate">
                              {vendor.email}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Số điện thoại:</span>
                            <span className="text-sm font-medium">{vendor.phone}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: adminColors.primary[100] }}>
                            <div className="flex items-center gap-2">
                              <Store className="h-4 w-4" style={{ color: adminColors.accent.emerald }} />
                              <span className="text-sm font-semibold text-gray-600">Số quán:</span>
                            </div>
                            <Badge 
                              className="font-bold px-3 py-1"
                              style={{ 
                                background: adminColors.gradients.primarySoft,
                                color: 'white'
                              }}
                            >
                              {vendor.restaurants.length}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 font-semibold"
                          style={{
                            background: adminColors.gradients.primarySoft,
                            color: 'white'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedVendor(vendor)
                            setViewMode("restaurants")
                          }}
                        >
                          Xem danh sách quán ăn
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Breadcrumb/Back Button */}
              <Card className="border-2 shadow-lg bg-white" style={{ borderColor: adminColors.primary[200] }}>
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setViewMode("vendors")
                      setSelectedVendor(null)
                    }}
                    className="gap-2 font-semibold"
                    style={{ color: adminColors.primary[600] }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại danh sách Vendor
                  </Button>
                  {selectedVendor && (
                    <div className="mt-4 p-4 rounded-xl" style={{ background: adminColors.primary[50] }}>
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ background: adminColors.gradients.primarySoft }}
                        >
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: adminColors.primary[700] }}>
                            {selectedVendor.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-600">{selectedVendor.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Restaurants List */}
              <Card className="border-2 shadow-xl bg-white overflow-hidden" style={{ borderColor: adminColors.primary[200] }}>
                <CardHeader 
                  className="text-white"
                  style={{ background: adminColors.gradients.primary }}
                >
                  <CardTitle className="text-white text-xl font-bold">
                    Danh sách Quán ăn
                  </CardTitle>
                  <CardDescription className="font-semibold" style={{ color: adminColors.primary[200] }}>
                    {selectedVendor?.name} - Tổng số: {selectedVendor?.restaurants.length ?? 0} quán
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {selectedVendor?.restaurants.map((restaurant) => (
                      <Card
                        key={restaurant.id}
                        className="border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white group"
                        style={{ borderColor: adminColors.primary[200] }}
                      >
                        <CardHeader className="pb-3">
                          <div className="h-40 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                            {restaurant.image ? (
                              <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <Store className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-xs text-gray-400">Chưa có hình ảnh</p>
                              </div>
                            )}
                          </div>
                          <CardTitle className="text-lg font-bold truncate" style={{ color: adminColors.primary[700] }}>
                            {restaurant.name}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {restaurant.address}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500">Ngày tạo:</p>
                                <p className="text-sm font-medium">
                                  {restaurant.createdAt
                                    ? new Date(restaurant.createdAt).toLocaleString()
                                    : "-"}
                                </p>
                              </div>
                              <Badge variant="approved">{restaurant.status}</Badge>
                            </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full font-semibold"
                                style={{
                                  background: adminColors.gradients.primarySoft,
                                  color: 'white'
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Chi tiết Quán ăn</DialogTitle>
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
                                          Quán ăn đang hoạt động tốt
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

                                {/* Right Column - Images */}
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
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
            </CardContent>
          </Card>
            </div>
          )}
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

