"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "@/components/cuisinefeatures/CuisineFeature";
import CuisineFeatures from "@/components/cuisinefeatures/CuisineFeature";
import DishCard from "@/components/recommendedfood/Card";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const dishes = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop",
      title: "Beef Pho: The Culinary Spirit of Hanoi",
      description: "Our broth, simmered for 12 hours with beef bones and aromatic spices, creates a naturally sweet and savory flavor. Paired with soft rice noodles and tender slices of rare beef, each spoonful is a taste of a timeless culinary tradition.",
      rating: 4,
      reviewCount: 584,
      price: 10.00
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      title: "Grilled Seafood Platter",
      description: "Fresh catches from the East Sea, grilled to perfection with aromatic herbs and spices. Each bite delivers the ocean's bounty with a smoky, charred flavor that captures the essence of coastal Vietnamese cuisine.",
      rating: 5,
      reviewCount: 892,
      price: 25.00
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop",
      title: "Mi Quang: Central Vietnam's Pride",
      description: "Turmeric-infused noodles topped with shrimp, pork, and fresh herbs, served with a small amount of rich broth. This iconic Quang Nam dish perfectly balances flavors and textures in every colorful bowl.",
      rating: 5,
      reviewCount: 1203,
      price: 8.50
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop",
      title: "Mi Quang: Central Vietnam's Pride",
      description: "Turmeric-infused noodles topped with shrimp, pork, and fresh herbs, served with a small amount of rich broth. This iconic Quang Nam dish perfectly balances flavors and textures in every colorful bowl.",
      rating: 5,
      reviewCount: 1203,
      price: 8.50
    }

  ];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
    // You can navigate to search results page or filter content
  };
  return (
    <div className="mt-auto">
      <div className="relative w-full h-auto">
        <Image 
          src="/images/HomePage.png"
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
              Khám phá ẩm thực tinh túy Đà Nẵng
            </h1>
            
            <p className="hidden md:block text-[#1C2B38] font-mulish font-semibold text-[11px] max-w-[569px] mx-auto">
              Ẩm thực Đà Nẵng - sự hòa quyện tinh tế của hương vị miền Trung. Từ tô mì Quảng đậm đà, bánh xèo giòn tan đến những món hải sản tươi ngon bậc nhất. Một hành trình vị giác đầy phóng khoáng và đáng nhớ.
            </p>

            {/* Watch Video Button */}
            <button className="hidden sm:flex items-center gap-2 mx-auto px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg">
              <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="font-mulish font-semibold text-[#1C2B38]">Watch Video</span>
            </button>
          </div>
          
        </div>
      </div>
       {/* Search Box */}
      <div className="-mt-20 z-50 relative mb-10">
       <form onSubmit={handleSearch} className="mt-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-2">
                <div className="flex flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm món ăn, quán ăn..."
                    className="w-full text-gray-600 font-mulish text-sm outline-none placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#FFDA32] hover:bg-yellow-400 text-[#1C2B38] font-mulish font-bold px-8 py-3 rounded-xl transition-all shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center mt-8 text-center">
          <h2 className="font-volkhov font-bold sm:text-2xl md:text-3xl lg:text-[36px] text-[#1C2B38]">Ẩm thực Đà Nẵng</h2>
          <p className="w-[60%] mt-2 font-mulish font-semibold sm:text-sm md:text-[15px] text-[#778088] whitespace-wrap">Khám phá ẩm thực Đà Nẵng với hương vị đặc trưng miền Trung, nơi hội tụ món ngon từ núi đến biển, mang đến trải nghiệm ẩm thực độc đáo và phong phú.</p>
        </div> 
        <div className="w-full flex justify-center items-center mt-8">
          <CuisineFeatures />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#44BACA] text-center mb-12">
          Món Ăn Đề Xuất
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              image={dish.image}
              title={dish.title}
              description={dish.description}
              rating={dish.rating}
              reviewCount={dish.reviewCount}
              price={dish.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}