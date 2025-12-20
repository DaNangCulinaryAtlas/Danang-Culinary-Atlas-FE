"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { logout } from "@/stores/auth"
import {
  LayoutDashboard,
  Shield,
  Users,
  Store,
  Utensils,
  MessageSquare,
  Flag,
  Settings,
  LogOut,
  FileCheck,
  Brain,
  ShieldCheck,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { adminColors } from "@/configs/colors"
import { API_ENDPOINTS, BASE_URL } from "@/configs/api"

const getMenuItems = (isSuperAdmin: boolean) => [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Quản trị Permission",
    href: "/admin/permissions",
    icon: Shield,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Quản lý Role",
    href: "/admin/roles",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Quản lý User Role",
    href: "/admin/user-roles",
    icon: UserCog,
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Quản lý Người dùng",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Quản lý Quán ăn",
    href: "/admin/restaurants",
    icon: Store,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Quản lý Món ăn",
    href: "/admin/dishes",
    icon: Utensils,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Quản lý Giấy phép",
    href: "/admin/licenses",
    icon: FileCheck,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Kiểm duyệt Đánh giá",
    href: "/admin/reviews",
    icon: MessageSquare,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Quản lý Báo cáo",
    href: "/admin/reports",
    icon: Flag,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Hệ thống Gợi ý",
    href: "/admin/recommendation",
    icon: Brain,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Cài đặt hệ thống",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [pendingRestaurantsCount, setPendingRestaurantsCount] = useState<number | null>(null)

  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") || false
  const userRoles = user?.roles || []
  const menuItems = getMenuItems(isSuperAdmin).filter(
    (item) => item.roles.some((role) => userRoles.includes(role))
  )

  useEffect(() => {
    const fetchPendingRestaurantsCount = async () => {
      try {
        const token =
          typeof window !== "undefined" ? window.localStorage.getItem("token") : null

        const params = new URLSearchParams()
        params.set("page", "0")
        params.set("size", "500") // lấy nhiều một lần, đủ cho hầu hết trường hợp
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
        const content: any[] = data?.content || data?.data?.content || []

        // Đếm số quán có approvalStatus = PENDING
        const pendingCount = content.filter(
          (item) => String(item.approvalStatus || "").toUpperCase() === "PENDING"
        ).length

        setPendingRestaurantsCount(pendingCount)
      } catch (error) {
        console.error(error)
        setPendingRestaurantsCount(null)
      }
    }

    fetchPendingRestaurantsCount()
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <div
      className="flex h-screen w-64 flex-col shadow-2xl relative overflow-hidden"
      style={{ background: adminColors.gradients.sidebar }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

      {/* Logo */}
      <div
        className="relative flex h-20 items-center px-6 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center shadow-xl transition-transform hover:scale-105"
            style={{
              background: adminColors.gradients.primarySoft
            }}
          >
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
              Admin Panel
            </h1>
            <p className="text-xs font-medium" style={{ color: adminColors.primary[200] }}>Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="relative flex-1 space-y-1.5 px-3 py-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 group relative",
                isActive
                  ? "text-white shadow-xl scale-[1.02]"
                  : "hover:text-white hover:translate-x-1"
              )}
              style={isActive ? {
                background: adminColors.gradients.primarySoft,
                boxShadow: `0 8px 20px rgba(12, 81, 111, 0.4), 0 0 0 1px rgba(255,255,255,0.1)`
              } : {
                color: adminColors.primary[200]
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = `rgba(12, 81, 111, 0.3)`
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <Icon className={cn(
                "h-5 w-5 transition-all duration-300",
                isActive ? "text-white scale-110" : "group-hover:text-white group-hover:scale-110"
              )} style={!isActive ? { color: adminColors.primary[300] } : {}} />
              <span className="flex-1">{item.title}</span>
              {item.href === "/admin/restaurants" && pendingRestaurantsCount !== null && (
                <Badge
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white shadow-lg"
                  style={{
                    background: isActive
                      ? adminColors.status.error
                      : `rgba(239, 68, 68, 0.85)`
                  }}
                >
                  {pendingRestaurantsCount}
                </Badge>
              )}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.9)' }}
                ></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div
        className="relative border-t p-4 backdrop-blur-sm"
      >
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-white hover:text-white transition-all duration-300 rounded-xl group"
          style={{ color: adminColors.primary[200] }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(239, 68, 68, 0.25)`
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = adminColors.primary[200]
          }}
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Đăng xuất</span>
        </Button>
      </div>
    </div>
  )
}

