"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/hooks/useRedux"
import { Loader2 } from "lucide-react"
import AccessDenied from "@/components/shared/AccessDenied"

interface VendorProtectedLayoutProps {
    children: React.ReactNode
}

export default function VendorProtectedLayout({ children }: VendorProtectedLayoutProps) {
    const router = useRouter()
    const { user, isAuthenticated, isHydrated } = useAppSelector((state) => state.auth)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted || !isHydrated) return

        // Only redirect to login if user is not authenticated at all
        if (!isAuthenticated || !user) {
            router.replace("/login")
            return
        }
    }, [isAuthenticated, user, router, mounted, isHydrated])

    // Show loading state while mounting or hydrating
    if (!mounted || !isHydrated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#44BACA]" />
            </div>
        )
    }

    // If not authenticated, don't render anything (will redirect)
    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#44BACA]" />
            </div>
        )
    }

    // Show access denied if user doesn't have VENDOR role
    if (!user.roles || !user.roles.includes("VENDOR")) {
        return <AccessDenied requiredRole="VENDOR" />
    }

    return <>{children}</>
}
