"use client";
import { useState, useMemo } from "react";
import { Search, Filter, Grid3x3, List, MapPin, Heart, Star, X, ChevronDown } from "lucide-react";
import DishCard from "@/components/dish";
import { Button } from "@/components/ui/button";
import type { Dish } from "@/types/dish";

// Mock data
const MOCK_DISHES: (Dish & {
  id: number;
  restaurant: string;
  address: string;
  distance: number;
  tags: string[];
  district: string;
  isFavorite?: boolean;
  badge?: string;
})[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop",
      title: "Bún Chả Hà Nội",
      description: "Bún chả truyền thống Hà Nội với nước chấm đặc biệt, thịt nướng thơm phức",
      rating: 4.8,
      reviewCount: 156,
      price: 45.00,
      restaurant: "Quán Bún Chả Sơn Trà",
      address: "123 Lê Duẩn, Hải Châu",
      distance: 1.2,
      tags: ["Món nướng", "Đặc sản", "Bún/Phở"],
      district: "Hải Châu",
      badge: "Bán chạy"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      title: "Hải Sản Nướng BBQ",
      description: "Hải sản tươi sống được nướng trên than hoa, kèm theo các loại rau củ",
      rating: 4.6,
      reviewCount: 89,
      price: 120.00,
      restaurant: "Nhà Hàng Hải Sản Biển Đông",
      address: "45 Võ Nguyên Giáp, Sơn Trà",
      distance: 3.5,
      tags: ["Hải sản", "Món nướng", "Món Á"],
      district: "Sơn Trà"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop",
      title: "Mì Quảng Đặc Biệt",
      description: "Mì Quảng truyền thống với tôm, thịt, trứng cút và bánh tráng giòn",
      rating: 4.9,
      reviewCount: 234,
      price: 35.00,
      restaurant: "Mì Quảng Bà Mua",
      address: "78 Hải Phòng, Thanh Khê",
      distance: 2.1,
      tags: ["Bún/Phở", "Đặc sản", "Món Việt"],
      district: "Thanh Khê",
      badge: "Bán chạy"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      title: "Pizza Hải Sản Ý",
      description: "Pizza đế mỏng với hải sản tươi và phô mai Mozzarella cao cấp",
      rating: 4.4,
      reviewCount: 67,
      price: 180.00,
      restaurant: "Ristorante Italiano",
      address: "234 Trần Phú, Hải Châu",
      distance: 1.8,
      tags: ["Món Âu", "Hải sản"],
      district: "Hải Châu"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      title: "Bánh Flan Caramen",
      description: "Bánh flan mềm mịn với lớp caramen đắng ngọt hài hòa",
      rating: 4.7,
      reviewCount: 112,
      price: 15.00,
      restaurant: "Tiệm Bánh Ngọt Hương Sen",
      address: "56 Lê Lợi, Thanh Khê",
      distance: 2.8,
      tags: ["Tráng miệng", "Bánh"],
      district: "Thanh Khê"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1580959375944-1506b1122ed2?w=800&h=600&fit=crop",
      title: "Cơm Chay Dinh Dưỡng",
      description: "Cơm chay với đầy đủ rau củ, đậu phụ và nấm các loại",
      rating: 4.5,
      reviewCount: 78,
      price: 40.00,
      restaurant: "Quán Chay An Nhiên",
      address: "167 Nguyễn Văn Linh, Hải Châu",
      distance: 2.3,
      tags: ["Món chay", "Món Việt"],
      district: "Hải Châu"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop",
      title: "Phở Bò Tái Nạm",
      description: "Phở bò với nước dùng ninh từ xương 12 tiếng đồng hồ",
      rating: 4.8,
      reviewCount: 198,
      price: 50.00,
      restaurant: "Phở Gia Truyền",
      address: "89 Hoàng Diệu, Hải Châu",
      distance: 1.5,
      tags: ["Bún/Phở", "Món Việt", "Đặc sản"],
      district: "Hải Châu",
      badge: "Bán chạy"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
      title: "Bánh Xèo Miền Trung",
      description: "Bánh xèo giòn tan với nhân tôm, thịt, giá đỗ",
      rating: 4.6,
      reviewCount: 145,
      price: 30.00,
      restaurant: "Bánh Xèo Bà Dưỡng",
      address: "45 Phan Châu Trinh, Hải Châu",
      distance: 1.9,
      tags: ["Bánh", "Món Việt", "Đặc sản"],
      district: "Hải Châu"
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      title: "Lẩu Thái Hải Sản",
      description: "Lẩu Thái chua cay với hải sản tươi sống và rau củ",
      rating: 4.7,
      reviewCount: 167,
      price: 250.00,
      restaurant: "Nhà Hàng Thái Lan",
      address: "123 Nguyễn Tất Thành, Liên Chiểu",
      distance: 4.2,
      tags: ["Hải sản", "Món Á"],
      district: "Liên Chiểu"
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
      title: "Steak Bò Úc",
      description: "Steak bò Úc cao cấp nướng medium rare với khoai tây nghiền",
      rating: 4.9,
      reviewCount: 89,
      price: 350.00,
      restaurant: "The Steakhouse",
      address: "78 An Thượng, Ngũ Hành Sơn",
      distance: 5.8,
      tags: ["Món Âu", "Món nướng"],
      district: "Ngũ Hành Sơn"
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
      title: "Bánh Tráng Cuốn Thịt Heo",
      description: "Bánh tráng cuốn thịt heo luộc với rau sống và nước chấm đặc biệt",
      rating: 4.5,
      reviewCount: 123,
      price: 25.00,
      restaurant: "Quán Hòa",
      address: "234 Hùng Vương, Hải Châu",
      distance: 2.0,
      tags: ["Món Việt", "Đặc sản"],
      district: "Hải Châu"
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
      title: "Tiramisu Ý",
      description: "Tiramisu truyền thống Ý với cà phê espresso và mascarpone",
      rating: 4.8,
      reviewCount: 76,
      price: 55.00,
      restaurant: "Cafe Italia",
      address: "56 Bạch Đằng, Hải Châu",
      distance: 1.7,
      tags: ["Tráng miệng", "Món Âu"],
      district: "Hải Châu"
    }
  ];

const DISTRICTS = ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ"];
const DISH_TAGS = ["Món nướng", "Món chay", "Bún/Phở", "Bánh", "Hải sản", "Món Á", "Món Âu", "Tráng miệng", "Món Việt", "Đặc sản"];
const PRICE_RANGES = [
  { label: "Dưới 30k", min: 0, max: 30 },
  { label: "30k - 50k", min: 30, max: 50 },
  { label: "50k - 100k", min: 50, max: 100 },
  { label: "Trên 100k", min: 100, max: Infinity }
];

export default function DishPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter and sort logic
  const filteredDishes = useMemo(() => {
    let result = MOCK_DISHES.filter(dish => {
      // Search filter
      const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.restaurant.toLowerCase().includes(searchQuery.toLowerCase());

      // District filter
      const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(dish.district);

      // Tags filter
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => dish.tags.includes(tag));

      // Price filter
      let matchesPrice = true;
      if (selectedPriceRange) {
        const range = PRICE_RANGES.find(r => r.label === selectedPriceRange);
        if (range) {
          matchesPrice = dish.price >= range.min && dish.price < range.max;
        }
      }

      // Rating filter
      const matchesRating = dish.rating >= minRating;

      return matchesSearch && matchesDistrict && matchesTags && matchesPrice && matchesRating;
    });

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, selectedDistricts, selectedTags, selectedPriceRange, minRating, sortBy]);

  const toggleDistrict = (district: string) => {
    setSelectedDistricts(prev =>
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDistricts([]);
    setSelectedTags([]);
    setSelectedPriceRange("");
    setMinRating(0);
  };

  const hasActiveFilters = selectedDistricts.length > 0 || selectedTags.length > 0 || selectedPriceRange || minRating > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#44BACA] to-[#69C3CF] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-volkhov font-bold text-4xl md:text-5xl text-center mb-4">
            Khám Phá Ẩm Thực Đà Nẵng
          </h1>
          <p className="text-center text-lg mb-8 opacity-90">
            Hơn {MOCK_DISHES.length} món ăn đặc sắc từ các nhà hàng uy tín
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm món ăn, nhà hàng..."
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 font-mulish text-base focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              onClick={() => setSelectedTags(["Món Việt"])}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2"
            >
              🍜 Món Việt
            </Button>
            <Button
              onClick={() => setSelectedTags(["Món Âu"])}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2"
            >
              🍕 Món Âu
            </Button>
            <Button
              onClick={() => setSelectedTags(["Tráng miệng"])}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2"
            >
              🍰 Tráng miệng
            </Button>
            <Button
              onClick={() => setSelectedTags(["Hải sản"])}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2"
            >
              🦐 Hải sản
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Bộ lọc</h3>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </Button>
                )}
              </div>

              {/* Districts Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Khu vực
                </h4>
                <div className="space-y-2">
                  {DISTRICTS.map(district => (
                    <label key={district} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDistricts.includes(district)}
                        onChange={() => toggleDistrict(district)}
                        className="rounded border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{district}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">🍽️ Loại món</h4>
                <div className="space-y-2">
                  {DISH_TAGS.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="rounded border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">💰 Khoảng giá</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.label}
                        onChange={() => setSelectedPriceRange(range.label)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">⭐ Đánh giá</h4>
                <div className="space-y-2">
                  {[4, 3, 2].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={minRating === rating}
                        onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                        className="rounded border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{rating}+ sao</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h4 className="font-semibold mb-3">📊 Sắp xếp</h4>
                <div className="space-y-2">
                  {[
                    { value: "popular", label: "Phổ biến nhất" },
                    { value: "price-asc", label: "Giá thấp → cao" },
                    { value: "price-desc", label: "Giá cao → thấp" },
                    { value: "rating", label: "Đánh giá cao nhất" }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        checked={sortBy === option.value}
                        onChange={() => setSortBy(option.value)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            {/* Results Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="font-semibold text-gray-700">
                  Tìm thấy <span className="text-[#44BACA]">{filteredDishes.length}</span> món ăn
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-lg px-4 py-2"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </Button>

                  {/* View Toggle */}
                  <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="lg:hidden border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="price-asc">Giá thấp → cao</option>
                    <option value="price-desc">Giá cao → thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedDistricts.map(district => (
                    <span key={district} className="inline-flex items-center gap-1 bg-[#44BACA]/10 text-[#44BACA] px-3 py-1 rounded-full text-sm">
                      {district}
                      <button onClick={() => toggleDistrict(district)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-[#44BACA]/10 text-[#44BACA] px-3 py-1 rounded-full text-sm">
                      {tag}
                      <button onClick={() => toggleTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedPriceRange && (
                    <span className="inline-flex items-center gap-1 bg-[#44BACA]/10 text-[#44BACA] px-3 py-1 rounded-full text-sm">
                      {selectedPriceRange}
                      <button onClick={() => setSelectedPriceRange("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#44BACA]/10 text-[#44BACA] px-3 py-1 rounded-full text-sm">
                      {minRating}+ sao
                      <button onClick={() => setMinRating(0)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Dishes Grid */}
            {filteredDishes.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
                }`}>
                {filteredDishes.map(dish => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="font-bold text-xl mb-2">Không tìm thấy món ăn phù hợp</h3>
                <p className="text-gray-600 mb-6">Thử xóa bộ lọc hoặc tìm kiếm từ khóa khác</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={clearFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-6 py-2"
                  >
                    Xóa bộ lọc
                  </Button>
                  <Button
                    onClick={() => {
                      clearFilters();
                      setSearchQuery("");
                    }}
                    className="bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-lg px-6 py-2"
                  >
                    Xem tất cả món
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Bộ lọc</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Same filters as desktop */}
            <div className="space-y-6">
              {/* Districts */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Khu vực
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {DISTRICTS.map(district => (
                    <label key={district} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDistricts.includes(district)}
                        onChange={() => toggleDistrict(district)}
                        className="rounded border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{district}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold mb-3">🍽️ Loại món</h4>
                <div className="grid grid-cols-2 gap-2">
                  {DISH_TAGS.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="rounded border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-semibold mb-3">💰 Khoảng giá</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobilePriceRange"
                        checked={selectedPriceRange === range.label}
                        onChange={() => setSelectedPriceRange(range.label)}
                        className="border-gray-300 text-[#44BACA] focus:ring-[#44BACA]"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-3"
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-lg py-3"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}