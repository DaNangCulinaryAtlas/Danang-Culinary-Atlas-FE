import { Restaurant, VendorGroup, VendorInfo, District, Ward } from "../types"

export function filterRestaurantsByLocation(
  restaurants: Restaurant[],
  provinceId: number | null,
  districtId: number | null,
  wardId: number | null,
  districts: District[],
  wards: Ward[]
): Restaurant[] {
  return restaurants.filter((restaurant) => {
    if (wardId !== null) {
      return restaurant.wardId === wardId
    }
    if (districtId !== null) {
      const wardIdsInDistrict = wards
        .filter((w) => w.districtId === districtId)
        .map((w) => w.wardId)
      return restaurant.wardId !== null && wardIdsInDistrict.includes(restaurant.wardId)
    }
    if (provinceId !== null) {
      const districtIdsInProvince = districts
        .filter((d) => d.provinceId === provinceId)
        .map((d) => d.districtId)
      const wardIdsInProvince = wards
        .filter((w) => districtIdsInProvince.includes(w.districtId))
        .map((w) => w.wardId)
      return restaurant.wardId !== null && wardIdsInProvince.includes(restaurant.wardId)
    }
    return true
  })
}

export function groupRestaurantsByVendor(
  restaurants: Restaurant[],
  vendorsById: Record<string, VendorInfo>
): VendorGroup[] {
  const map = new Map<string, VendorGroup>()

  restaurants.forEach((r) => {
    if (!r.ownerAccountId) return
    const key = r.ownerAccountId
    const vendorInfo = vendorsById[key]
    if (!map.has(key)) {
      map.set(key, {
        ownerAccountId: key,
        name: vendorInfo?.name ?? `Vendor ${key.slice(0, 6)}`,
        email: vendorInfo?.email ?? "",
        phone: vendorInfo?.phone ?? "",
        restaurants: [],
      })
    }
    map.get(key)!.restaurants.push(r)
  })

  return Array.from(map.values())
}

