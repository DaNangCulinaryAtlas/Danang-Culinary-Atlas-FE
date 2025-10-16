import { Marker, Popup } from 'react-map-gl/maplibre';
import type { Restaurant } from '@/types/restaurant';
import { useState } from 'react';
import PopupCard from './PopupCard';

export default function RestaurantMarker({ 
  restaurant 
}: { 
  restaurant: Restaurant 
}) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Marker
        longitude={restaurant.lng}
        latitude={restaurant.lat}
        anchor="center"
        onClick={() => setShowPopup(true)}
      >
        <div
          className="cursor-pointer transform hover:scale-110 transition-transform"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={restaurant.lng}
          latitude={restaurant.lat}
          anchor="bottom"
          offset={[0, -10]}
          closeButton={false}
          onClose={() => setShowPopup(false)}
        >
          <PopupCard 
            restaurant={restaurant} 
            onClose={() => setShowPopup(false)} 
          />
        </Popup>
      )}
    </>
  );
}