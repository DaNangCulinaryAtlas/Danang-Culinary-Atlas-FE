import { memo } from "react";

interface SearchResultProps {
  totalResults: number;
  searchTime: number;
}

const SearchResult = memo(function SearchResult({ totalResults, searchTime }: SearchResultProps) {
  return (
    <p className="text-gray-600">
      Tìm thấy{" "}
      <span className="font-semibold text-[#44BACA]">
        {totalResults} kết quả
      </span>{" "}
      trong <span className="font-semibold">{searchTime} giây </span>
    </p>
  );
});

export default SearchResult;