"use client";
import Footer from "@/components/footer";
import Header from "@/components/navbar";
import { store } from "@/stores";
import { Provider } from "react-redux";
import { ReactQueryProvider } from "@/hooks";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Provider store={store}>
        <ReactQueryProvider>
            <Header />
            <div className="min-h-screen">
              <div className="h-14" />
              {children}
            </div>
            <Footer />
        </ReactQueryProvider>
      </Provider>
    </>
  )
}