"use client"

import VendorSidebar from "@/components/vendor/Sidebar"
import VendorHeader from "@/components/vendor/Header"
import VendorProtectedLayout from "@/components/vendor/VendorProtectedLayout"
import { AuthProvider } from "@/contexts/AuthContext"
import { store } from "@/stores"
import { Provider } from "react-redux"
import { vendorColors } from "@/configs/colors"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider"
import { Toaster } from "react-hot-toast"

export default function VendorLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Provider store={store}>
            <ReactQueryProvider>
                <AuthProvider>
                    <VendorProtectedLayout>
                        <div className="flex h-screen overflow-hidden">
                            <VendorSidebar />
                            <div className="flex flex-1 flex-col overflow-hidden">
                                <VendorHeader />
                                <main
                                    className="flex-1 overflow-y-auto p-6 md:p-8"
                                    style={{
                                        background: vendorColors.gradients.card
                                    }}
                                >
                                    {children}
                                </main>
                            </div>
                        </div>
                        <Toaster position="top-right" />
                    </VendorProtectedLayout>
                </AuthProvider>
            </ReactQueryProvider>
        </Provider>
    )
}
