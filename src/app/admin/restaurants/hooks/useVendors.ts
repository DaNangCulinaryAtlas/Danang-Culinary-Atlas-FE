import { useState, useEffect } from "react"
import { API_ENDPOINTS, BASE_URL } from "@/configs/api"
import { VendorInfo } from "../types"
import { toast } from "react-toastify"

export function useVendors() {
  const [vendorsById, setVendorsById] = useState<Record<string, VendorInfo>>({})

  const fetchVendors = async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const all: VendorInfo[] = []
      let page = 0
      const size = 200

      while (true) {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("size", String(size))

        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.ADMIN.VENDORS_LIST}?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )

        if (!response.ok) {
          throw new Error("Không thể tải danh sách vendor")
        }

        const data = await response.json()
        const content = data?.data?.content || data?.content || []

        const normalized: VendorInfo[] = content.map((item: any) => ({
          accountId: String(item.accountId ?? item.id ?? ""),
          name: item.fullName || [item.firstName, item.lastName].filter(Boolean).join(" ") || "Không xác định",
          email: item.email ?? "",
          phone: item.phoneNumber ?? "",
        }))

        all.push(...normalized)

        if (!Array.isArray(content) || content.length < size) {
          break
        }

        page++
      }

      const map: Record<string, VendorInfo> = {}
      all.forEach((v) => {
        map[v.accountId] = v
      })

      setVendorsById(map)
    } catch (err) {
      toast.error('Không thể tải danh sách vendor', {
               position: 'top-right',
               autoClose: 2500,
               });
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  return { vendorsById }
}

