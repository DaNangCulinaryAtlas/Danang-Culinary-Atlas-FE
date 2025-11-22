"use client"

import { useState } from "react"
import { Search, Bell, CircleUser } from "lucide-react"
import { Input } from "@/components/ui/input"
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
  const [notifications] = useState(3) // Mock notification count

  return (
    <header 
      className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/95 backdrop-blur-xl shadow-md"
      style={{ borderColor: adminColors.primary[100] }}
    >
      {/* Global Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors" style={{ color: adminColors.primary[400] }} />
          <Input
            type="search"
            placeholder="Tìm kiếm toàn cục..."
            className="pl-9 bg-white/80 backdrop-blur-sm transition-all border-2 focus:border-2"
            style={{
              borderColor: adminColors.primary[200],
            } as React.CSSProperties}
            onFocus={(e) => {
              e.target.style.borderColor = adminColors.primary[500]
              e.target.style.boxShadow = `0 0 0 3px ${adminColors.primary[50]}`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = adminColors.primary[200]
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative transition-all duration-200 rounded-lg hover:scale-105"
          style={{ color: adminColors.neutral[500] }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = adminColors.primary[50]
            e.currentTarget.style.color = adminColors.primary[600]
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = adminColors.neutral[500]
          }}
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs text-white shadow-lg animate-pulse font-bold"
              style={{ background: `linear-gradient(135deg, ${adminColors.status.error}, #F87171)` }}
            >
              {notifications}
            </Badge>
          )}
        </Button>

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
                  ringColor: adminColors.primary[100]
                }}
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

