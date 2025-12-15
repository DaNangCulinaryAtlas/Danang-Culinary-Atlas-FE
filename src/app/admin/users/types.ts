export interface AccountItem {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatarUrl?: string | null
  joinedAt?: string
  phone?: string
  vendorName?: string
}

export const roleLabels: Record<string, string> = {
  USER: "User",
  VENDOR: "Vendor",
  ADMIN: "Admin",
}

export const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  BLOCKED: "Blocked",
  DELETED: "Deleted",
}

