"use client";
import Footer from "@/components/footer";
import Header from "@/components/navbar";
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
    <Provider store={store}>
      <AuthProvider>
          <Header />
            <div className="min-h-screen">
              <div className="h-14"/> 
                  {children}
            </div>
           <Footer />
      </AuthProvider>
    </Provider>
    </>
 )
}