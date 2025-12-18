import { memo } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchResultProps {
  totalResults: number;
  searchTime: number;
}

const SearchResult = memo(function SearchResult({ totalResults, searchTime }: SearchResultProps) {
  const { t } = useTranslation();

  return (
    <p className="text-gray-600">
      {t('restaurants.found')}{" "}
      <span className="font-semibold text-[#44BACA]">
        {totalResults} {t('restaurants.resultsText')}
      </span>{" "}
      {t('restaurants.in')} <span className="font-semibold">{searchTime} {t('restaurants.seconds')} </span>
    </p>
  );
});

export default SearchResult;