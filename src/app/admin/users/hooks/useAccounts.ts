import { useState, useEffect, useCallback } from "react"
import { BASE_URL, API_ENDPOINTS } from "@/configs/api"
import { AccountItem } from "../types"

export function useAccounts(accountType: "USER" | "VENDOR", statusFilter: string) {
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalAccounts, setTotalAccounts] = useState(0)

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const endpoint =
        accountType === "VENDOR"
          ? API_ENDPOINTS.ADMIN.VENDORS_LIST
          : API_ENDPOINTS.ADMIN.USERS_LIST
      const chunkSize = 200
      let currentPage = 0
      let accumulated: AccountItem[] = []
      let totalElements = 0
      
      while (true) {
        const params = new URLSearchParams()
        params.set("page", String(currentPage))
        params.set("size", String(chunkSize))
        if (statusFilter !== "ALL") params.set("status", statusFilter)
        
        const response = await fetch(`${BASE_URL}${endpoint}?${params.toString()}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tài khoản")
        }
        
        const data = await response.json()
        const content = data?.data?.content || data?.data?.items || data?.data || []
        const normalized: AccountItem[] = content.map((item: any, index: number) => ({
          id: String(item.accountId ?? item.id ?? item.email ?? `${currentPage}-${index}`),
          name:
            item.fullName ||
            item.name ||
            [item.firstName, item.lastName].filter(Boolean).join(" ") ||
            item.email?.split("@")[0] ||
            "Không xác định",
          email: item.email ?? "N/A",
          role: (item.role || accountType).toUpperCase(),
          status: (item.status || "ACTIVE").toUpperCase(),
          avatarUrl: item.avatarUrl || item.avatar || null,
          joinedAt: item.createdAt || item.joinDate || item.updatedAt,
          phone: item.phoneNumber || item.phone || "",
          vendorName: item.vendorName || item.businessName || "",
        }))
        
        accumulated = [...accumulated, ...normalized]
        totalElements =
          data?.data?.totalElements ||
          data?.data?.total ||
          data?.meta?.total ||
          data?.totalElements ||
          accumulated.length
        
        if (accumulated.length >= totalElements || content.length === 0) {
          break
        }
        currentPage += 1
      }
      
      setAccounts(accumulated)
      setTotalAccounts(accumulated.length)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Có lỗi xảy ra")
      setAccounts([])
      setTotalAccounts(0)
    } finally {
      setIsLoading(false)
    }
  }, [accountType, statusFilter])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return {
    accounts,
    isLoading,
    error,
    totalAccounts,
    refetch: fetchAccounts,
  }
}

