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
    rejectionReason?: string | null
    openingHours?: Record<string, unknown>
    tags?: string[] | null
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

export interface PaginationInfo {
    pageNumber: number
    pageSize: number
    totalPages: number
    totalElements: number
    first: boolean
    last: boolean
}
