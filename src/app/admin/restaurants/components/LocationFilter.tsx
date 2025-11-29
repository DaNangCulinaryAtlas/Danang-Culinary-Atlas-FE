"use client"

import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminColors } from "@/configs/colors"
import { Province, District, Ward } from "../types"

interface LocationFilterProps {
  provinces: Province[]
  districts: District[]
  wards: Ward[]
  provinceId: number | null
  districtId: number | null
  wardId: number | null
  onProvinceChange: (provinceId: number | null) => void
  onDistrictChange: (districtId: number | null) => void
  onWardChange: (wardId: number | null) => void
}

export default function LocationFilter({
  provinces,
  districts,
  wards,
  provinceId,
  districtId,
  wardId,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
}: LocationFilterProps) {
  // Normalize IDs to numbers for comparison
  const availableDistricts = provinceId !== null
    ? districts.filter((d) => Number(d.provinceId) === Number(provinceId))
    : []

  const availableWards = districtId !== null
    ? wards.filter((w) => Number(w.districtId) === Number(districtId))
    : []

  // Debug: Log available districts when province is selected
  useEffect(() => {
    if (provinceId !== null) {
      console.log("Selected provinceId:", provinceId)
      console.log("All districts:", districts)
      console.log("Available districts:", availableDistricts)
    }
  }, [provinceId, districts, availableDistricts])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
          Tỉnh/Thành phố
        </Label>
        <Select
          value={provinceId ? String(provinceId) : "all"}
          onValueChange={(value) => {
            onProvinceChange(value === "all" ? null : Number(value))
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {provinces.map((province) => (
              <SelectItem key={province.provinceId} value={String(province.provinceId)}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
          Quận/Huyện
        </Label>
        <Select
          value={districtId ? String(districtId) : "all"}
          onValueChange={(value) => {
            onDistrictChange(value === "all" ? null : Number(value))
          }}
          disabled={provinceId === null}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Chọn quận/huyện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {availableDistricts.map((district) => (
              <SelectItem key={district.districtId} value={String(district.districtId)}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold mb-1.5 block" style={{ color: adminColors.primary[700] }}>
          Xã/Phường
        </Label>
        <Select
          value={wardId ? String(wardId) : "all"}
          onValueChange={(value) => {
            onWardChange(value === "all" ? null : Number(value))
          }}
          disabled={districtId === null}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Chọn xã/phường" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {availableWards.map((ward) => (
              <SelectItem key={ward.wardId} value={String(ward.wardId)}>
                {ward.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

