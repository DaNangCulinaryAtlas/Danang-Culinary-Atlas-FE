import { memo } from "react";

interface SearchResultPagesProps {
  resultsPerPage: number;
  setResultsPerPage: (count: number) => void;
}

const resultOptions = [9, 12, 24, 48];

const SearchResultPages = memo(function SearchResultPages({ 
  resultsPerPage, 
  setResultsPerPage 
}: SearchResultPagesProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="results-select" className="text-sm text-gray-600 whitespace-nowrap">
        Kết quả
      </label>
      <select
        id="results-select"
        value={resultsPerPage}
        onChange={(e) => setResultsPerPage(Number(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#44BACA] focus:border-transparent"
      >
        {resultOptions.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </div>
  );
});

export default SearchResultPages;