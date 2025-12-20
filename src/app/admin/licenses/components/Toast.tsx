import React, { useEffect } from "react"
import { CheckCircle2, XCircle } from "lucide-react"

interface ToastProps {
    type: "success" | "error"
    message: string
}

export default function Toast({ type, message }: ToastProps) {
    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
            >
                {type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    )
}
