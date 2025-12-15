"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_STYLES } from '@/styles/map-styles';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapPickerProps {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number) => void;
}

const DEFAULT_DA_NANG = {
    latitude: 16.0544,
    longitude: 108.2022,
    zoom: 13
};

export function LocationMapPicker({ latitude, longitude, onLocationChange }: LocationMapPickerProps) {
    const mapRef = useRef<MapRef>(null);
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([
        longitude || DEFAULT_DA_NANG.longitude,
        latitude || DEFAULT_DA_NANG.latitude
    ]);

    const [viewState, setViewState] = useState({
        longitude: longitude || DEFAULT_DA_NANG.longitude,
        latitude: latitude || DEFAULT_DA_NANG.latitude,
        zoom: DEFAULT_DA_NANG.zoom
    });

    // Update marker position when props change
    useEffect(() => {
        if (latitude && longitude) {
            setMarkerPosition([longitude, latitude]);
            setViewState(prev => ({
                ...prev,
                longitude,
                latitude
            }));
        }
    }, [latitude, longitude]);

    // Handle map click to place marker
    const handleMapClick = useCallback((event: any) => {
        const { lngLat } = event;
        const newLng = lngLat.lng;
        const newLat = lngLat.lat;

        setMarkerPosition([newLng, newLat]);
        onLocationChange(newLat, newLng);
    }, [onLocationChange]);

    // Get current location
    const handleGetCurrentLocation = useCallback(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    setMarkerPosition([lng, lat]);
                    setViewState({
                        longitude: lng,
                        latitude: lat,
                        zoom: 16
                    });
                    onLocationChange(lat, lng);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.');
                }
            );
        } else {
            alert('Trình duyệt không hỗ trợ định vị.');
        }
    }, [onLocationChange]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Click vào bản đồ để chọn vị trí nhà hàng
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    className="text-xs"
                >
                    <MapPin className="h-3 w-3 mr-1" />
                    Vị trí hiện tại
                </Button>
            </div>

            <div className="relative w-full h-[400px] border-2 border-gray-300 rounded-lg overflow-hidden">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    onClick={handleMapClick}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle={MAP_STYLES.positron}
                    cursor="crosshair"
                >
                    {/* Selected Location Marker */}
                    <Marker
                        longitude={markerPosition[0]}
                        latitude={markerPosition[1]}
                        anchor="bottom"
                        draggable
                        onDragEnd={(event) => {
                            const newLng = event.lngLat.lng;
                            const newLat = event.lngLat.lat;
                            setMarkerPosition([newLng, newLat]);
                            onLocationChange(newLat, newLng);
                        }}
                    >
                        <div className="flex flex-col items-center">
                            <div className="bg-red-600 text-white p-2 rounded-full shadow-lg border-4 border-white animate-bounce">
                                <MapPin className="w-6 h-6" fill="white" />
                            </div>
                            <div className="mt-1 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold shadow-md whitespace-nowrap">
                                Vị trí nhà hàng
                            </div>
                        </div>
                    </Marker>
                </Map>
            </div>

            <p className="text-xs text-gray-500">
                Tọa độ: {markerPosition[1].toFixed(6)}, {markerPosition[0].toFixed(6)}
            </p>
        </div>
    );
}
