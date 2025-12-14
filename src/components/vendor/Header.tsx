"use client"

import { useEffect, useState } from "react"
import { Bell, CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { vendorColors } from "@/configs/colors"
import NotificationPanel from "@/components/notification/NotificationPanel"
import { useNotifications } from "@/hooks/queries/useNotifications"
import ProfileModal from "@/components/navbar/components/ProfileModal"

export default function VendorHeader() {
    const [mounted, setMounted] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [modalProfileOpen, setModalProfileOpen] = useState(false)

    // Fetch notifications to get unread count
    const { data } = useNotifications(10)
    const notifications = data?.pages.flatMap(page => page.content) || []
    const unreadCount = notifications.filter(n => !n.isRead).length

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <>
            <header
                className="sticky top-0 z-40 flex h-16 items-center justify-end gap-4 border-b bg-white/95 backdrop-blur-xl shadow-md px-6"
                style={{ borderColor: vendorColors.primary[100] }}
            >
                <div className="flex items-center gap-2">
                    {/* Notification Bell */}
                    <div className="relative notification-bell">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="relative h-9 w-9 rounded-full transition-all duration-200 hover:scale-110"
                            style={{ color: vendorColors.neutral[600] }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = vendorColors.primary[50]
                                e.currentTarget.style.color = vendorColors.primary[600]
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = vendorColors.neutral[600]
                            }}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                                    style={{
                                        background: vendorColors.status.error,
                                        color: 'white',
                                        border: '2px solid white'
                                    }}
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Badge>
                            )}
                        </Button>
                        <NotificationPanel
                            isOpen={isNotificationOpen}
                            onClose={() => setIsNotificationOpen(false)}
                        />
                    </div>

                    {/* Profile */}
                    <Button
                        variant="ghost"
                        onClick={() => setModalProfileOpen(true)}
                        className="flex items-center gap-2 transition-all duration-200 rounded-lg px-3 hover:scale-105"
                        style={{ color: vendorColors.neutral[600] }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = vendorColors.primary[50]
                            e.currentTarget.style.color = vendorColors.primary[600]
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = vendorColors.neutral[600]
                        }}
                    >
                        <div
                            className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 transition-transform hover:scale-110"
                            style={{
                                background: vendorColors.gradients.primarySoft,
                                '--tw-ring-color': vendorColors.primary[100]
                            } as React.CSSProperties}
                        >
                            <CircleUser className="h-5 w-5" />
                        </div>
                        <span className="hidden md:inline font-semibold">Vendor User</span>
                    </Button>
                </div>
            </header>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={modalProfileOpen}
                onClose={() => setModalProfileOpen(false)}
                colorScheme={{
                    primary: vendorColors.primary[600],
                    primaryBorder: vendorColors.primary[600],
                    primaryBg: vendorColors.primary[50],
                    footerBg: vendorColors.primary[50]
                }}
                title="Hồ sơ Vendor"
                redirectAfterLogout="/"
            />
        </>
    )
}
