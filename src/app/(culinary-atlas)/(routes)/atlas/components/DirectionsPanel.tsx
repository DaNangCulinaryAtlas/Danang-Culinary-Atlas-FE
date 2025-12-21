import React from 'react';
import { Navigation, X, MapPin, ArrowUp, ArrowUpRight, ArrowRight, ArrowUpLeft, ArrowLeft, MoveRight } from 'lucide-react';
import { formatDistance, formatDuration, type RouteResponse } from '@/services/directions';
import type { MapRestaurant } from '@/types/restaurant';
import { useTranslation } from '@/hooks/useTranslation';

interface DirectionsPanelProps {
    routeData: RouteResponse;
    selectedRestaurant: MapRestaurant;
    onClose: () => void;
}

const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
    routeData,
    selectedRestaurant,
    onClose
}) => {
    const { t } = useTranslation();
    // Get icon for maneuver type
    const getManeuverIcon = (type: string, modifier?: string) => {
        const iconClass = "w-4 h-4";

        if (type === 'depart') return <ArrowUp className={iconClass} />;
        if (type === 'arrive') return <MapPin className={iconClass} />;
        if (type === 'continue' || type === 'new name') return <ArrowUp className={iconClass} />;

        if (type === 'turn') {
            if (modifier === 'left') return <ArrowLeft className={iconClass} />;
            if (modifier === 'right') return <ArrowRight className={iconClass} />;
            if (modifier === 'slight left') return <ArrowUpLeft className={iconClass} />;
            if (modifier === 'slight right') return <ArrowUpRight className={iconClass} />;
            if (modifier === 'sharp left') return <ArrowLeft className={iconClass} />;
            if (modifier === 'sharp right') return <ArrowRight className={iconClass} />;
        }

        if (type === 'fork') {
            if (modifier === 'left') return <ArrowUpLeft className={iconClass} />;
            if (modifier === 'right') return <ArrowUpRight className={iconClass} />;
        }

        if (type === 'end of road') {
            if (modifier === 'left') return <ArrowLeft className={iconClass} />;
            if (modifier === 'right') return <ArrowRight className={iconClass} />;
        }

        return <MoveRight className={iconClass} />;
    };

    return (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-sm z-10">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">{t('atlas.directions')}</h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-2 mb-3">
                <div className="text-sm">
                    <span className="text-gray-600">{t('atlas.to')}: </span>
                    <span className="font-semibold text-gray-900">
                        {selectedRestaurant.name}
                    </span>
                </div>
                <div className="flex gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">{t('atlas.distance')}: </span>
                        <span className="font-semibold text-blue-600">
                            {formatDistance(routeData.distance)}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600">{t('atlas.duration')}: </span>
                        <span className="font-semibold text-blue-600">
                            {formatDuration(routeData.duration)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Turn-by-turn instructions */}
            <div className="border-t pt-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('atlas.stepByStepGuide')}:</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {routeData.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-3 items-start bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600">
                                    {getManeuverIcon(instruction.type, instruction.modifier)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-xs font-medium text-gray-900 leading-tight">
                                        {instruction.text}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {formatDistance(instruction.distance)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DirectionsPanel;
