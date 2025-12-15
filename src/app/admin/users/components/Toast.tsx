"use client"

interface ToastProps {
  type: "success" | "error"
  message: string
}

export default function Toast({ type, message }: ToastProps) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg transition-all ${
        type === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  )
}

