"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useRedux"
import { logout } from "@/stores/auth"
import {
    LayoutDashboard,
    Store,
    Utensils,
    MessageSquare,
    LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { vendorColors } from "@/configs/colors"

const menuItems = [
    {
        title: "Tổng quan",
        href: "/vendor",
        icon: LayoutDashboard,
    },
    {
        title: "Quản lý Quán ăn",
        href: "/vendor/restaurants",
        icon: Store,
    },
    {
        title: "Quản lý Món ăn",
        href: "/vendor/dishes",
        icon: Utensils,
    },
    {
        title: "Đánh giá",
        href: "/vendor/reviews",
        icon: MessageSquare,
    },
]

export default function VendorSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        dispatch(logout())
        router.push('/')
    }

    return (
        <div
            className="flex h-screen w-64 flex-col shadow-2xl relative overflow-hidden"
            style={{ background: vendorColors.gradients.sidebar }}
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
                            background: vendorColors.gradients.primarySoft
                        }}
                    >
                        <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                            Vendor Panel
                        </h1>
                        <p className="text-xs font-medium" style={{ color: vendorColors.primary[200] }}>Dashboard</p>
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
                                background: vendorColors.gradients.primarySoft,
                            } : {
                                color: vendorColors.primary[200]
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = `rgba(139, 92, 246, 0.25)`
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
                            )} style={!isActive ? { color: vendorColors.primary[300] } : {}} />
                            <span className="flex-1">{item.title}</span>
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
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-white hover:text-white transition-all duration-300 rounded-xl group"
                    style={{ color: vendorColors.primary[200] }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = `rgba(139, 92, 246, 0.25)`
                        e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = vendorColors.primary[200]
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span className="font-semibold">Đăng xuất</span>
                </Button>
            </div>
        </div>
    )
}
