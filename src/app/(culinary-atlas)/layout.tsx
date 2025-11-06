"use client";
import Footer from "@/components/footer";
import Header from "@/components/navbar/parent";
import { AuthProvider } from "@/contexts/AuthContext";
import { store } from "@/stores";
import { Provider } from "react-redux";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
       <Header />
       <div className="min-h-screen">
          <div className="h-14"/> {/* Spacer */}
          <Provider store={store}>
            <AuthProvider>{children}</AuthProvider>
           </Provider>
       </div>
       <Footer />
    </>
 )
}