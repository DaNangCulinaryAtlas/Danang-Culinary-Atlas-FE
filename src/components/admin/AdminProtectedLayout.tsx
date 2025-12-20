"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/hooks/useRedux"
import { Loader2 } from "lucide-react"
import AccessDenied from "@/components/shared/AccessDenied"

interface AdminProtectedLayoutProps {
    children: React.ReactNode
}

export default function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
    const router = useRouter()
    const { user, isAuthenticated } = useAppSelector((state) => state.auth)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Only redirect to login if user is not authenticated at all
        if (!isAuthenticated || !user) {
            router.replace("/login")
            return
        }
    }, [isAuthenticated, user, router, mounted])

    // Show loading state while mounting
    if (!mounted) {
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

    // Show access denied if user doesn't have ADMIN or SUPER_ADMIN role
    if (!user.roles || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
        return <AccessDenied requiredRole="ADMIN or SUPER_ADMIN" />
    }

    return <>{children}</>
}
