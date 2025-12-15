"use client"

import { useEffect, useState } from "react"
import { CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminColors } from "@/configs/colors"
import ProfileModal from "@/components/navbar/components/ProfileModal"

export default function AdminHeader() {
  const [mounted, setMounted] = useState(false)
  const [modalProfileOpen, setModalProfileOpen] = useState(false)

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
        style={{ borderColor: adminColors.primary[100] }}
      >
        <div className="flex items-center gap-2">
          {/* Profile */}
          <Button
            variant="ghost"
            onClick={() => setModalProfileOpen(true)}
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
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={modalProfileOpen}
        onClose={() => setModalProfileOpen(false)}
        colorScheme={{
          primary: adminColors.primary[600],
          primaryBorder: adminColors.primary[600],
          primaryBg: adminColors.primary[50],
          footerBg: adminColors.primary[50]
        }}
        title="Hồ sơ Admin"
        redirectAfterLogout="/"
      />
    </>
  )
}

