"use client";
import { useEffect, useRef } from "react";
import Footer from "@/components/footer";
import Header from "@/components/navbar";
import UserOnlyLayout from "@/components/layouts/UserOnlyLayout";
import { store } from "@/stores";
import { hydrateAuth } from "@/stores/auth";
import { Provider } from "react-redux";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

// Component to hydrate auth state from localStorage on client mount
function AuthHydration() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

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
          <UserOnlyLayout>
            <Header />
            <div className="min-h-screen">
              <div className="h-14" />
              {children}
            </div>
            <Footer />
          </UserOnlyLayout>
        </ReactQueryProvider>
      </Provider>
    </>
  )
}