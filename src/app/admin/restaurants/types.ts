export interface Restaurant {
  id: string
  ownerAccountId: string
  name: string
  address: string
  status: string
  approvalStatus: string
  createdAt?: string
  image?: string | null
  subPhotos?: string[]
  latitude?: number | null
  longitude?: number | null
  averageRating?: number | null
  totalReviews?: number | null
  wardId?: number | null
}

export interface Province {
  provinceId: number
  name: string
}

export interface District {
  districtId: number
  name: string
  provinceId: number
}

export interface Ward {
  wardId: number
  name: string
  districtId: number
}

export interface VendorInfo {
  accountId: string
  name: string
  email: string
  phone: string
}

export interface VendorGroup {
  ownerAccountId: string
  name: string
  email: string
  phone: string
  restaurants: Restaurant[]
}

