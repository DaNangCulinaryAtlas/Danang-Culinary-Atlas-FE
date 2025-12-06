// OpenRouteService API for routing
// Free tier: 2000 requests/day, no credit card required
// Sign up at: https://openrouteservice.org/dev/#/signup

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || '5b3ce3597851110001cf6248a1b8c0b1c28a41ffb1c4d42d6b0c4c4e';

export interface RouteResponse {
    coordinates: [number, number][]; // [lng, lat]
    distance: number; // meters
    duration: number; // seconds
    instructions: {
        text: string;
        distance: number;
        duration: number;
        type: string; // turn type: straight, left, right, etc
        modifier?: string; // slight, sharp, etc
    }[];
}

export const getDirections = async (
    startLng: number,
    startLat: number,
    endLng: number,
    endLat: number
): Promise<RouteResponse> => {
    try {
        const response = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`
        );

        if (!response.ok) {
            throw new Error('Failed to get directions');
        }

        const data = await response.json();
        const route = data.features[0];

        return {
            coordinates: route.geometry.coordinates,
            distance: route.properties.segments[0].distance,
            duration: route.properties.segments[0].duration,
            instructions: route.properties.segments[0].steps.map((step: any) => ({
                text: step.instruction,
                distance: step.distance,
                duration: step.duration
            }))
        };
    } catch (error) {
        console.error('Error getting directions:', error);
        throw error;
    }
};

// Helper to translate maneuver to Vietnamese
const translateManeuver = (type: string, modifier?: string, name?: string): string => {
    const modifierText = modifier ? ` ${modifier}` : '';
    const nameText = name ? ` vào ${name}` : '';

    switch (type) {
        case 'depart':
            return `Bắt đầu${nameText}`;
        case 'arrive':
            return `Đã đến đích${nameText}`;
        case 'turn':
            if (modifier === 'left') return `Rẽ trái${nameText}`;
            if (modifier === 'right') return `Rẽ phải${nameText}`;
            if (modifier === 'slight left') return `Rẽ trái nhẹ${nameText}`;
            if (modifier === 'slight right') return `Rẽ phải nhẹ${nameText}`;
            if (modifier === 'sharp left') return `Rẽ trái gấp${nameText}`;
            if (modifier === 'sharp right') return `Rẽ phải gấp${nameText}`;
            return `Rẽ${modifierText}${nameText}`;
        case 'new name':
            return `Tiếp tục${nameText}`;
        case 'continue':
            return `Đi thẳng${nameText}`;
        case 'merge':
            return `Nhập làn${nameText}`;
        case 'on ramp':
            return `Đi vào đường nhánh${nameText}`;
        case 'off ramp':
            return `Thoát khỏi đường nhánh${nameText}`;
        case 'fork':
            if (modifier === 'left') return `Giữ bên trái tại ngã ba${nameText}`;
            if (modifier === 'right') return `Giữ bên phải tại ngã ba${nameText}`;
            return `Chọn hướng tại ngã ba${nameText}`;
        case 'roundabout':
            return `Đi vào vòng xuyến${nameText}`;
        case 'rotary':
            return `Đi vào vòng xuyến${nameText}`;
        case 'end of road':
            if (modifier === 'left') return `Cuối đường, rẽ trái${nameText}`;
            if (modifier === 'right') return `Cuối đường, rẽ phải${nameText}`;
            return `Cuối đường${nameText}`;
        case 'notification':
            if (modifier === 'left') return `Chuẩn bị rẽ trái${nameText}`;
            if (modifier === 'right') return `Chuẩn bị rẽ phải${nameText}`;
            return `Chuẩn bị${nameText}`;
        default:
            return `Tiếp tục đi${nameText}`;
    }
};

// Alternative: Use OSRM (free, no API key needed)
export const getDirectionsOSRM = async (
    startLng: number,
    startLat: number,
    endLng: number,
    endLat: number
): Promise<RouteResponse> => {
    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`
        );

        if (!response.ok) {
            throw new Error('Failed to get directions');
        }

        const data = await response.json();
        const route = data.routes[0];

        return {
            coordinates: route.geometry.coordinates,
            distance: route.distance,
            duration: route.duration,
            instructions: route.legs[0].steps.map((step: any) => {
                const maneuver = step.maneuver;
                const type = maneuver.type;
                const modifier = maneuver.modifier;
                const name = step.name || '';

                return {
                    text: translateManeuver(type, modifier, name),
                    distance: step.distance,
                    duration: step.duration,
                    type: type,
                    modifier: modifier
                };
            })
        };
    } catch (error) {
        console.error('Error getting directions:', error);
        throw error;
    }
};

// Format distance for display
export const formatDistance = (meters: number): string => {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
};

// Format duration for display
export const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};
