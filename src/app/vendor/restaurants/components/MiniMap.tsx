"use client"

import { MapPin } from "lucide-react"

interface MiniMapProps {
    latitude: number | null | undefined
    longitude: number | null | undefined
    restaurantName: string
}

export default function MiniMap({ latitude, longitude, restaurantName }: MiniMapProps) {
    if (!latitude || !longitude) {
        return (
            <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Chưa có thông tin vị trí</p>
                </div>
            </div>
        )
    }

    // Sử dụng OpenStreetMap (miễn phí, không cần API key)
    const zoom = 0.01 // Độ zoom (khoảng cách bbox)
    const bbox = `${longitude - zoom},${latitude - zoom},${longitude + zoom},${latitude + zoom}`
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`

    return (
        <div className="h-48 bg-muted rounded-md overflow-hidden relative border border-gray-200">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
                title={`Bản đồ vị trí ${restaurantName}`}
                className="w-full h-full"
            />
            {/* Link để mở trong tab mới */}
            <div className="absolute bottom-2 right-2">
                <a
                    href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white/90 hover:bg-white px-2 py-1 rounded shadow-sm text-primary hover:underline font-medium transition-colors"
                >
                    Mở bản đồ lớn
                </a>
            </div>
        </div>
    )
}
