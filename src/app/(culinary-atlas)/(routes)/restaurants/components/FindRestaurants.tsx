"use client";
import Image from 'next/image';
import SearchBox from './SearchBox';
import { useTranslation } from '@/hooks/useTranslation';

export default function FindRestaurants() {
    const { t } = useTranslation();
    return (
        <div className="relative w-full h-[450px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/images/danang-find-restaurant.jpg"
                    alt="Da Nang Background"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 space-y-6">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg font-volkhov">
                        {t('restaurants.findTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 drop-shadow-md font-mulish">
                        {t('restaurants.findSubtitle')}
                    </p>
                </div>


                {/* Search Box */}
                <SearchBox/>
            </div>
        </div>
    );
}