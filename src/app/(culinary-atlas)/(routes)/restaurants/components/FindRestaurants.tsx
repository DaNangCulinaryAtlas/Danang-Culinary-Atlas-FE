import { Search } from 'lucide-react';
import Image from 'next/image';
import SearchBox from './SearchBox';
import PopularCuisines from './PopularCuisines';
import TagLine from './TagLine';

export default function FindRestaurants() {
    return (
        <div className="relative w-full h-[400px]">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/images/danang-find-restaurant.jpg"
                    alt="Da Nang Background"
                    width={1920}
                    height={400}
                    className="w-full h-full object-cover brightness-75"
                    priority
                />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">

                {/* Search Box */}
                <SearchBox/>
                
                {/* Popular Cuisines */}
                <PopularCuisines/>
            </div>
        </div>
    );
}