"use client";

import { I18nProvider } from "@/components/providers/I18nProvider";
import { ToastContainer } from "react-toastify";
import Toast from "@/components/providers/Toast";
import "react-toastify/dist/ReactToastify.css";

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
