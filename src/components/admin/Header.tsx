"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useRedux"
import { logout } from "@/stores/auth"
import { Bell, CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { adminColors } from "@/configs/colors"

export default function AdminHeader() {
  const notifications = 3
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <header 
      className="sticky top-0 z-40 flex h-16 items-center justify-end gap-4 border-b bg-white/95 backdrop-blur-xl shadow-md px-6"
      style={{ borderColor: adminColors.primary[100] }}
    >
      <div className="flex items-center gap-2">
        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 transition-all duration-200 rounded-lg px-3 hover:scale-105"
              style={{ color: adminColors.neutral[600] }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = adminColors.primary[50]
                e.currentTarget.style.color = adminColors.primary[600]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = adminColors.neutral[600]
              }}
            >
              <div 
                className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 transition-transform hover:scale-110"
                style={{
                  background: adminColors.gradients.primarySoft,
                  '--tw-ring-color': adminColors.primary[100]
                } as React.CSSProperties}
              >
                <CircleUser className="h-5 w-5" />
              </div>
              <span className="hidden md:inline font-semibold">Admin User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-2xl rounded-lg" style={{ borderColor: adminColors.primary[100] }}>
            <DropdownMenuLabel style={{ color: adminColors.primary[600] }} className="font-bold">Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: adminColors.primary[100] }} />
            <DropdownMenuItem 
              className="cursor-pointer transition-colors font-medium"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = adminColors.primary[50]
                e.currentTarget.style.color = adminColors.primary[600]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'inherit'
              }}
            >
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer transition-colors font-medium"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = adminColors.primary[50]
                e.currentTarget.style.color = adminColors.primary[600]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'inherit'
              }}
            >
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: adminColors.primary[100] }} />
            <DropdownMenuItem 
              className="cursor-pointer transition-colors font-medium"
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FEE2E2'
                e.currentTarget.style.color = adminColors.status.error
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'inherit'
              }}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

