"use client";

// import { I18nProvider } from "@/components/providers/I18nProvider";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import Toast from "@/components/providers/Toast";
import "react-toastify/dist/ReactToastify.css";

const I18nProvider = dynamic(
  () => import("@/components/providers/I18nProvider").then((mod) => mod.I18nProvider),
  { ssr: false }
);

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider initialLanguage="vi">
      {children}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Toast />
    </I18nProvider>
  );
}
