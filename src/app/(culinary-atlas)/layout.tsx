"use client";
import { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/navbar";
import { store } from "@/stores";
import { hydrateAuth } from "@/stores/auth";
import { Provider } from "react-redux";
import { ReactQueryProvider } from "@/hooks";

// Component to hydrate auth state from localStorage on client mount
function AuthHydration() {
  useEffect(() => {
    store.dispatch(hydrateAuth());
  }, []);

  return null;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Provider store={store}>
        <AuthHydration />
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