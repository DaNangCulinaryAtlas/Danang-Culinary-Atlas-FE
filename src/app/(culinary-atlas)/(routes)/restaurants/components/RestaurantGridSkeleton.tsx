export default function RestaurantGridSkeleton({ count = 9 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
                >
                    {/* Image skeleton */}
                    <div className="w-full h-48 bg-gray-200" />

                    {/* Content skeleton */}
                    <div className="p-5 space-y-3">
                        {/* Title skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>

                        {/* Address skeleton */}
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                        </div>

                        {/* Rating skeleton */}
                        <div className="flex items-center gap-2 pt-2">
                            <div className="h-4 bg-gray-200 rounded w-24" />
                            <div className="h-4 bg-gray-200 rounded w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
