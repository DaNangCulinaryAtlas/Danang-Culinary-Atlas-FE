"use client";
import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RestaurantMapProps {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
}

export default function RestaurantMap({ latitude, longitude, name, address }: RestaurantMapProps) {
    const [showPopup, setShowPopup] = useState(true);

    return (
        <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg">
            <Map
                initialViewState={{
                    longitude,
                    latitude,
                    zoom: 15,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            >
                <Marker longitude={longitude} latitude={latitude} color="#44BACA" />
                {showPopup && (
                    <Popup longitude={longitude} latitude={latitude} offset={[0, -10]} onClose={() => setShowPopup(false)}>
                        <div className="p-3">
                            <p className="font-semibold text-gray-900">{name}</p>
                            <p className="text-sm text-gray-600 mt-1">{address}</p>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
