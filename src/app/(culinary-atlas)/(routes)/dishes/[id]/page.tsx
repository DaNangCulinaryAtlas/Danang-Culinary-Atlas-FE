"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, MapPin, Store, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDishDetail } from '@/hooks/queries/useDishDetail';
import { useRestaurantDetail } from '@/hooks/queries/useRestaurantDetail';

export default function DishDetail() {
  const router = useRouter();
  const params = useParams();
  const dishId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  // Fetch dish data
  const { data: dish, isLoading, error } = useDishDetail(dishId);

  // Fetch restaurant data if restaurantId is available
  const { data: restaurant } = useRestaurantDetail(dish?.restaurantId || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#44BACA] animate-spin" />
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không thể tải thông tin món ăn</p>
          <Button onClick={() => router.back()} className="bg-[#44BACA] text-white">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const images = dish.images && dish.images.length > 0
    ? dish.images
    : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Dish Header - Name & Info Card */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{dish.name}</h1>
            <button
              onClick={() => router.back()}
              className="shrink-0 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Price & Status */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="text-3xl font-bold text-[#44BACA]">
              {formatPrice(dish.price)}
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              {dish.status === 'AVAILABLE' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-semibold">Còn món</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-semibold">Hết món</span>
                </>
              )}
            </div>
          </div>

          {/* Restaurant Info */}
          {restaurant && (
            <button
              onClick={() => router.push(`/restaurants/${dish.restaurantId}`)}
              className="flex items-center gap-2 mb-4 text-gray-700 hover:text-[#44BACA] transition-colors group"
            >
              <Store className="w-5 h-5" />
              <span className="font-medium group-hover:underline">{restaurant.name}</span>
              {restaurant.address && (
                <>
                  <span className="text-gray-400">•</span>
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{restaurant.address}</span>
                </>
              )}
            </button>
          )}

          {/* Approval Status Badge */}
          <div className="flex flex-wrap gap-2">
            {dish.approvalStatus === 'APPROVED' && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Đã được duyệt
              </span>
            )}
            {dish.approvalStatus === 'PENDING' && (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Đang chờ duyệt
              </span>
            )}
            {dish.approvalStatus === 'REJECTED' && (
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Đã bị từ chối
              </span>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#44BACA] mb-4">Hình ảnh món ăn</h2>
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden mb-4 shadow-lg bg-gray-200">
                {!imageError[`main-${selectedImageIndex}`] ? (
                  <Image
                    src={images[selectedImageIndex]}
                    alt={`${dish.name} - ${selectedImageIndex}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    priority={selectedImageIndex === 0}
                    onError={() => setImageError({ ...imageError, [`main-${selectedImageIndex}`]: true })}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-600">Không thể tải hình ảnh</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {images.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-300 bg-gray-200 ${selectedImageIndex === index
                          ? 'ring-2 ring-[#44BACA]'
                          : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                      {!imageError[`thumb-${index}`] ? (
                        <Image
                          src={photo}
                          alt={`Thumbnail ${index}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                          onError={() => setImageError({ ...imageError, [`thumb-${index}`]: true })}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xs text-gray-600">
                          Error
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden mb-4 shadow-lg bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600">Chưa có hình ảnh</span>
            </div>
          )}
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#44BACA] mb-4">Mô tả món ăn</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {dish.description || 'Chưa có mô tả cho món ăn này.'}
            </p>
          </div>
        </section>

        {/* Dish Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#44BACA] mb-4">Thông tin món ăn</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Price */}
              <div className="p-6 border-b md:border-r border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Giá</div>
                <div className="text-2xl font-bold text-[#44BACA]">
                  {formatPrice(dish.price)}
                </div>
              </div>

              {/* Status */}
              <div className="p-6 border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Trạng thái</div>
                <div className="flex items-center gap-2">
                  {dish.status === 'AVAILABLE' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-lg font-semibold text-green-600">Còn món</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-lg font-semibold text-red-600">Hết món</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Rejection Reason */}
            {dish.rejectionReason && (
              <div className="p-6 border-t border-gray-200 bg-red-50">
                <div className="text-sm text-red-600 font-semibold mb-2">Lý do từ chối</div>
                <p className="text-gray-700">{dish.rejectionReason}</p>
              </div>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-4">
          <Button
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl py-6 text-lg font-semibold"
          >
            Quay lại
          </Button>
          {restaurant && (
            <Button
              onClick={() => router.push(`/restaurants/${dish.restaurantId}`)}
              className="flex-1 bg-[#44BACA] hover:bg-[#3aa3b3] text-white rounded-xl py-6 text-lg font-semibold"
            >
              Xem nhà hàng
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}