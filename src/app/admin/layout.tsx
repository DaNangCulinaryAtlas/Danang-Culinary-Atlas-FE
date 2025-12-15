"use client"

import Sidebar from "@/components/admin/Sidebar"
import AdminHeader from "@/components/admin/Header"
import AdminProtectedLayout from "@/components/admin/AdminProtectedLayout"
import { AuthProvider } from "@/contexts/AuthContext"
import { store } from "@/stores"
import { Provider } from "react-redux"
import { adminColors } from "@/configs/colors"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <AuthProvider>
          <AdminProtectedLayout>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />
                <main
                  className="flex-1 overflow-y-auto p-6 md:p-8"
                  style={{
                    background: adminColors.gradients.card
                  }}
                >
                  {children}
                </main>
              </div>
            </div>
          </AdminProtectedLayout>
        </AuthProvider>
      </ReactQueryProvider>
    </Provider>
  )
}

