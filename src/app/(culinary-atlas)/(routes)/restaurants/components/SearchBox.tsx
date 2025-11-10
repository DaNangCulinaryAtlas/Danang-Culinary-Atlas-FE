import { Search } from "lucide-react";

export default function SearchBox() {
    return(
        <div className="w-full max-w-3xl">
            <div className="bg-white rounded-lg shadow-xl p-4 flex items-center">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                    type="text"
                    placeholder="Search for Restaurants by Name..."
                    className="flex-1 px-4 font-mulish text-gray-700 placeholder-gray-400 font-light text-2xl md:text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                />
            </div>
        </div>
    )
}