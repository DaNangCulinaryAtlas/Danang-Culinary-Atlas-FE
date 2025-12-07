"use client"

import VendorProtectedLayout from "@/components/vendor/VendorProtectedLayout"
import { AuthProvider } from "@/contexts/AuthContext"
import { store } from "@/stores"
import { Provider } from "react-redux"

export default function VendorLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <VendorProtectedLayout>
                    <div className="min-h-screen bg-gray-50">
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                            </div>
                        </header>
                        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            {children}
                        </main>
                    </div>
                </VendorProtectedLayout>
            </AuthProvider>
        </Provider>
    )
}
