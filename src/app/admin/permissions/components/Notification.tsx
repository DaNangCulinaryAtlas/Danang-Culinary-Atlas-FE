"use client"

import { CheckCircle2, XCircle } from "lucide-react"

interface NotificationProps {
  type: "success" | "error" | null
  message: string
}

export default function Notification({ type, message }: NotificationProps) {
  if (!type || !message) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg transition-all ${
        type === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
      <span>{message}</span>
    </div>
  )
}

