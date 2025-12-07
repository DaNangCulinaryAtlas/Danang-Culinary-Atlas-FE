"use client"

import { useRouter } from "next/navigation"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "@/hooks/useRedux"

interface AccessDeniedProps {
    requiredRole?: string
    currentRole?: string
}

export default function AccessDenied({ requiredRole, currentRole }: AccessDeniedProps) {
    const router = useRouter()
    const { t } = useTranslation()
    const { user } = useAppSelector((state) => state.auth)

    const handleGoHome = () => {
        // Redirect based on user role
        if (user?.roles?.includes("ADMIN")) {
            router.replace('/admin')
        } else if (user?.roles?.includes("VENDOR")) {
            router.replace('/vendor')
        } else {
            router.replace('/')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-red-100 p-4">
                            <ShieldAlert className="w-12 h-12 text-red-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t('accessDenied.title')}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {requiredRole
                            ? t('accessDenied.messageWithRole', { role: requiredRole })
                            : t('accessDenied.message')
                        }
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleGoHome}
                            className="w-full bg-[#44BACA] hover:bg-[#3aa3b3] text-white"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            {t('accessDenied.homeLink')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
