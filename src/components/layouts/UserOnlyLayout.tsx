"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/hooks/useRedux"
import { Loader2 } from "lucide-react"
import AccessDenied from "@/components/shared/AccessDenied"

interface UserOnlyLayoutProps {
    children: React.ReactNode
}

export default function UserOnlyLayout({ children }: UserOnlyLayoutProps) {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Show loading while checking
    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#44BACA]" />
            </div>
        )
    }

    // Allow access to authentication pages for everyone
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password']
    if (authPages.includes(pathname)) {
        return <>{children}</>
    }

    // Only block if user is authenticated AND has ADMIN or VENDOR role
    // Allow unauthenticated users and USER role to access
    if (isAuthenticated && user) {
        if (user.roles?.includes("ADMIN")) {
            return <AccessDenied requiredRole="USER" currentRole="ADMIN" />
        }
        if (user.roles?.includes("VENDOR")) {
            return <AccessDenied requiredRole="USER" currentRole="VENDOR" />
        }
    }

    return <>{children}</>
}
