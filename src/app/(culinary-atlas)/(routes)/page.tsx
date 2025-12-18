"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CuisineFeatures from "@/components/cuisinefeatures";
import DishCard from "@/components/dish";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MapPin, Star } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { useAppSelector } from "@/hooks/useRedux";
import { useRecommendedDishesWithDetails, useRecommendedRestaurantsWithDetails } from "@/hooks/queries/useRecommendationsWithDetails";

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Get user ID from Redux state (empty string if not logged in)
  const accountId = useAppSelector((state) => state.auth.accountId);
  const userId = accountId || "";

  // Update current hour every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Fetch recommended dishes with details
  const {
    data: recommendedDishes,
    isLoading: isDishesLoading,
    isError: isDishesError
  } = useRecommendedDishesWithDetails(userId, currentHour, 4);

  // Fetch recommended restaurants with details
  const {
    data: recommendedRestaurants,
    isLoading: isRestaurantsLoading,
    isError: isRestaurantsError
  } = useRecommendedRestaurantsWithDetails(userId, currentHour, 4);

  // Map recommended dishes to the Dish type expected by DishCard
  const dishes = (recommendedDishes || []).map((dish: any) => ({
    id: dish.dishId,
    image: dish.images && dish.images.length > 0 ? dish.images[0] : "/images/default-dish.png",
    title: dish.name,
    description: dish.description || "Món ăn đặc sản",
    rating: 4.5,
    reviewCount: 0,
    price: dish.price / 1000 // Convert VND to display format
  }));
  return (
    <div className="mt-auto">
      <div className="relative w-full h-auto mb-32">
        <Image
          src="/images/Homepage.png"
          className="w-full h-auto"
          alt="Danang Culinary Atlas"
          width={1720}
          height={1000}
          priority
        />
        {/* Thêm overlay và padding-top để tránh header */}
        <div className="absolute inset-0 flex items-center justify-center pt-16">
          <div className="text-center max-w-4xl space-y-6">
            <h1 className="hidden md:block text-[#1C2B38] font-bold font-volkhov text-3xl md:text-4xl lg:text-[40px] leading-tight">
              {t('home.heroTitle')}
            </h1>

            <p className="hidden md:block text-[#1C2B38] font-mulish font-semibold text-[11px] max-w-[569px] mx-auto">
              {t('home.heroDescription')}
            </p>

            {/* Watch Video Button */}
            <button className="hidden sm:flex items-center gap-2 mx-auto px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg">
              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-mulish font-semibold text-[#1C2B38]">{t('home.watchVideo')}</span>
            </button>
          </div>

        </div>

      </div>

      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center mt-8 text-center">
          <h2 className="font-volkhov font-bold sm:text-2xl md:text-3xl lg:text-[36px] text-[#44BACA]">{t('home.cuisineTitle')}</h2>
          <p className="w-[60%] mt-2 font-mulish font-semibold sm:text-sm md:text-[15px] text-[#778088] whitespace-wrap">{t('home.cuisineDescription')}</p>
        </div>
        <div className="w-full flex justify-center items-center mt-8">
          <CuisineFeatures />
        </div>
      </div>

      {/* Dishes Carousel Section */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#44BACA] text-center mb-12">
          {t('home.recommendedDishes')}
        </h1>
        {isDishesLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BACA]"></div>
          </div>
        ) : dishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Không có món ăn nào</p>
          </div>
        )}
      </div>

      {/* Banner Section */}
      <div className="relative w-full mt-10">
        {/* Banner Image */}
        <Image
          src="/images/banner.png"
          alt="Banner"
          width={1920}
          height={300}
          className="w-full md:h-[400px] lg:h-[500px]"
          priority
        />

        {/* Overlay Content - aligned left */}
        <div className="absolute inset-0 flex items-center justify-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-xl lg:max-w-2xl flex flex-col gap-3 sm:gap-4 text-left">

              {/* Trending Badge */}
              <Button className="bg-[#AFFFF0] text-[#1C2B38] font-bold rounded-full px-4 py-2 w-fit">
                {t('home.trendingNow')}
              </Button>

              {/* Title */}
              <h2 className="font-volkhov font-bold text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                {t('home.bannerTitle')}
              </h2>

              {/* Location + Rating */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('home.vietnam')}</span>
                </div>

                <div className="h-3 sm:h-4 w-px bg-white/30"></div>

                <div className="flex items-center gap-2 text-white">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span className="text-white/80">(300 {t('home.reviews')})</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-mulish font-semibold text-xs sm:text-sm lg:text-base text-white max-w-[400px] sm:max-w-lg">
                {t('home.bannerDescription')}
              </p>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-4 pt-2">
                <button className="px-8 py-3 lg:px-10 lg:py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-base lg:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                  {t('home.exploreNow')}
                </button>

                {[Heart, Share2].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-3 lg:p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Restaurants Section */}
      <h1 className="text-4xl font-bold text-[#44BACA] text-center mt-16">
        {t('home.recommendedRestaurants')}
      </h1>
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          {isRestaurantsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44BACA]"></div>
            </div>
          ) : isRestaurantsError ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{t('home.errorLoadingRestaurants')}</p>
            </div>
          ) : recommendedRestaurants.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('home.noRestaurants')}</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedRestaurants.map((restaurant: any) => (
                <RestaurantCard
                  key={restaurant.restaurantId}
                  restaurant={restaurant}
                  onClick={() => router.push(`/restaurants/${restaurant.restaurantId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-12">
      </div>
    </div>
  );
}
