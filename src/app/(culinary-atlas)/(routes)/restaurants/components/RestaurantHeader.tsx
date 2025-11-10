import { memo, Dispatch, SetStateAction } from "react";
import SearchResult from "./SearchResult";
import SearchResultPages from "./SearchResultPages";
import ViewToggle from "./ViewToggle";
import ViewMode from "@/types/view-mode";

interface RestaurantHeaderProps {
    totalResults: number;
    searchTime: number;
    resultsPerPage: number;
    setResultsPerPage: Dispatch<SetStateAction<number>>;
    viewMode: ViewMode;
    setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const RestaurantHeader = memo(function RestaurantHeader({
    totalResults,
    searchTime,
    resultsPerPage,
    setResultsPerPage,
    viewMode,
    setViewMode,
}: RestaurantHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <SearchResult
                totalResults={totalResults}
                searchTime={searchTime}
            />

            <div className="flex flex-wrap items-center gap-3">
                <SearchResultPages
                    resultsPerPage={resultsPerPage}
                    setResultsPerPage={setResultsPerPage}
                />

                <ViewToggle
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            </div>
        </div>
    );
});

export default RestaurantHeader;
