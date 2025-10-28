import { Marker, Popup } from 'react-map-gl/maplibre';
import type { Restaurant } from '@/types/restaurant';
import { useState, useRef, useEffect } from 'react';
import PopupCard from './PopupCard';
import Image from 'next/image';

export default function RestaurantMarker({ 
  restaurant 
}: { 
  restaurant: Restaurant 
}) {
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [isHoveringMarker, setIsHoveringMarker] = useState(false);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle popup visibility based on hover states
  useEffect(() => {
    if (isHoveringMarker || isHoveringPopup) {
      setShowPopup(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      // Add delay before hiding popup
      timeoutRef.current = setTimeout(() => {
        setShowPopup(false);
      }, 200);
    }
  }, [isHoveringMarker, isHoveringPopup]);

  const handleMarkerClick = () => {
    setShowPopup(!showPopup);
  };

  const handleMarkerMouseEnter = () => {
    setIsHoveringMarker(true);
  };

  const handleMarkerMouseLeave = () => {
    setIsHoveringMarker(false);
  };

  const handlePopupMouseEnter = () => {
    setIsHoveringPopup(true);
  };

  const handlePopupMouseLeave = () => {
    setIsHoveringPopup(false);
  };

  const handleClose = () => {
    setShowPopup(false);
    setIsHoveringMarker(false);
    setIsHoveringPopup(false);
  };

  return (
    <>
      <Marker
        longitude={restaurant.lng}
        latitude={restaurant.lat}
        anchor="bottom"
      >
        <div
          className="cursor-pointer transform hover:scale-110 transition-transform"
          onClick={handleMarkerClick}
          onMouseEnter={handleMarkerMouseEnter}
          onMouseLeave={handleMarkerMouseLeave}
        >
          <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <Image
              width={100}
              height={100}
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
          anchor="top"
          offset={[0, 15]}
          closeButton={false}
          onClose={handleClose}
          className="restaurant-popup"
        >
          <div
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
          >
            <PopupCard 
              restaurant={restaurant} 
              onClose={handleClose} 
            />
          </div>
        </Popup>
      )}
    </>
  );
}