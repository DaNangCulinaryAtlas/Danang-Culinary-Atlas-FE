import { statusLabels, roleLabels } from "../types"

export const formatDate = (value?: string) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("vi-VN")
}

export const isValidImageUrl = (value?: string | null) => {
  if (!value || typeof value !== "string") return false
  try {
    // Next/Image requires absolute URLs unless configured otherwise
    const parsed = new URL(value)
    return Boolean(parsed.protocol && parsed.host)
  } catch {
    return false
  }
}

export const displayStatus = (status: string) => statusLabels[status] || status
export const displayRole = (role: string) => roleLabels[role] || role

