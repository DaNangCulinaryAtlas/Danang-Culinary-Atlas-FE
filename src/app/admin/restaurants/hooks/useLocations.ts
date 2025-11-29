import { useState, useEffect, useCallback } from "react"
import { API_ENDPOINTS, BASE_URL } from "@/configs/api"
import { Province, District, Ward } from "../types"

export function useLocations() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchProvinces = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ADMIN.PROVINCES_LIST}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        throw new Error("Không thể tải danh sách tỉnh/thành phố")
      }
      const data = await response.json()
      const provincesList = Array.isArray(data) ? data : data?.data || []
      setProvinces(provincesList)
    } catch (err) {
      console.error("Error fetching provinces:", err)
    }
  }, [])

  const fetchDistricts = useCallback(async (provinceId: number) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.DISTRICTS_BY_PROVINCE(String(provinceId))}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )
      if (!response.ok) {
        throw new Error("Không thể tải danh sách quận/huyện")
      }
      const data = await response.json()
      const districtsList = Array.isArray(data) ? data : data?.data || []
      
      // Normalize provinceId to number for comparison
      const normalizedDistricts = districtsList.map((d: any) => ({
        ...d,
        provinceId: Number(d.provinceId),
      }))
      
      setDistricts((prev) => {
        // Remove existing districts for this province and add new ones
        const existing = prev.filter((d) => Number(d.provinceId) !== Number(provinceId))
        return [...existing, ...normalizedDistricts]
      })
    } catch (err) {
      console.error("Error fetching districts:", err)
    }
  }, [])

  const fetchWards = useCallback(async (districtId: number) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADMIN.WARDS_BY_DISTRICT(String(districtId))}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )
      if (!response.ok) {
        throw new Error("Không thể tải danh sách xã/phường")
      }
      const data = await response.json()
      const wardsList = Array.isArray(data) ? data : data?.data || []
      
      // Normalize districtId to number for comparison
      const normalizedWards = wardsList.map((w: any) => ({
        ...w,
        districtId: Number(w.districtId),
      }))
      
      setWards((prev) => {
        // Remove existing wards for this district and add new ones
        const existing = prev.filter((w) => Number(w.districtId) !== Number(districtId))
        return [...existing, ...normalizedWards]
      })
    } catch (err) {
      console.error("Error fetching wards:", err)
    }
  }, [])

  useEffect(() => {
    fetchProvinces()
  }, [fetchProvinces])

  return {
    provinces,
    districts,
    wards,
    isLoading,
    fetchDistricts,
    fetchWards,
  }
}

