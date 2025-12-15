import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchRestaurantsByName } from "@/hooks/queries/useRestaurants";
import { useRouter } from "next/navigation";

export default function SearchBox() {
    const [searchInput, setSearchInput] = useState("");
    const router = useRouter();

    // Use the search hook with debounce
    const { data: searchResults, isLoading } = useSearchRestaurantsByName(
        searchInput,
        { page: 0, size: 20, sortBy: 'createdAt', sortDirection: 'desc' }
    );

    // Debounce the search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();

            if (searchInput.trim()) {
                // If search input has value, add it to URL
                params.set("name", searchInput);
                params.set("page", "1");
                router.push(`/restaurants?${params.toString()}`);
            } else {
                // If search input is empty, navigate without name param
                params.set("page", "1");
                router.push(`/restaurants?${params.toString()}`);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchInput, router]);

    return (
        <div className="w-full max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-4 flex items-center relative">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for Restaurants by Name..."
                    className="flex-1 px-4 font-mulish text-gray-700 placeholder-gray-400 font-light text-2xl md:text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                />
                {isLoading && searchInput.trim() && (
                    <div className="mr-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#44BACA]"></div>
                    </div>
                )}
            </div>
        </div>
    );
}