import { useState, useEffect } from "react"
import { API_ENDPOINTS, BASE_URL } from "@/configs/api"
import { Restaurant } from "../types"

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRestaurants = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
      const all: Restaurant[] = []
      let page = 0
      const size = 100

      while (true) {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("size", String(size))
        params.set("sortBy", "createdAt")
        params.set("sortDirection", "desc")

        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.ADMIN.RESTAURANTS_LIST}?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )

        if (!response.ok) {
          throw new Error("Không thể tải danh sách quán ăn")
        }

        const data = await response.json()
        const content = data?.content || data?.data?.content || []

        const normalized: Restaurant[] = content.map((item: any) => ({
          id: item.restaurantId ?? item.id ?? "",
          ownerAccountId: item.ownerAccountId ?? "",
          name: item.name ?? "Không xác định",
          address: item.address ?? "N/A",
          status: (item.status || "").toUpperCase(),
          approvalStatus: (item.approvalStatus || "").toUpperCase(),
          createdAt: item.createdAt,
          image: item.images?.photo || null,
          subPhotos: Array.isArray(item.images?.sub_photo) ? item.images.sub_photo : [],
          latitude: item.latitude ?? null,
          longitude: item.longitude ?? null,
          averageRating: item.averageRating ?? null,
          totalReviews: item.totalReviews ?? null,
          wardId: item.wardId ?? null,
        }))

        all.push(...normalized)

        if (!Array.isArray(content) || content.length < size) {
          break
        }

        page++
      }

      setRestaurants(all)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Có lỗi xảy ra khi tải quán ăn")
      setRestaurants([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  return {
    restaurants,
    isLoading,
    error,
    refetch: fetchRestaurants,
  }
}

