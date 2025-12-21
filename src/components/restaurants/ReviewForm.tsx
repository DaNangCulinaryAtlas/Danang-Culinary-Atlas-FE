'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, Send, AlertCircle, ImagePlus, X, Loader2 } from 'lucide-react';
import { useCreateReview } from '@/hooks/mutations/useCreateReview';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary } from '@/services/upload-image';
import axios from 'axios';

interface ReviewFormProps {
  restaurantId: string;
}

interface ImagePreview {
  file: File;
  preview: string;
  cloudinaryUrl?: string;
  isUploading?: boolean;
  uploadError?: string;
}

export default function ReviewForm({ restaurantId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { mutate: createReview, isPending } = useCreateReview({ restaurantId });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Create preview objects for each file
    const newImages: ImagePreview[] = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
    }));

    setImages(prev => [...prev, ...newImages]);

    // Upload each image to Cloudinary
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const imageIndex = images.length + i;

      try {
        const result = await uploadImageToCloudinary(file);

        if (result.success && result.data) {
          // Update the image with Cloudinary URL
          setImages(prev => prev.map((img, idx) =>
            idx === imageIndex
              ? { ...img, cloudinaryUrl: result.data, isUploading: false }
              : img
          ));
        } else {
          // Update with error
          setImages(prev => prev.map((img, idx) =>
            idx === imageIndex
              ? { ...img, isUploading: false, uploadError: result.message || 'Upload failed' }
              : img
          ));
          toast.error(`Failed to upload image: ${result.message}`);
        }
      } catch (error) {
        setImages(prev => prev.map((img, idx) =>
          idx === imageIndex
            ? { ...img, isUploading: false, uploadError: 'Upload failed' }
            : img
        ));
        toast.error('Failed to upload image');
      }
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
  };

  const validateForm = (): boolean => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return false;
    }

    if (comment.trim().length === 0) {
      toast.error('Please write a review');
      return false;
    } else if (comment.trim().length < 2) {
      toast.error('Review must be at least 2 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please log in to post a review');
      router.push('/login');
      return;
    }

    if (!validateForm()) return;

    // Check if any images are still uploading
    const isAnyImageUploading = images.some(img => img.isUploading);
    if (isAnyImageUploading) {
      toast.warning('Please wait for all images to finish uploading');
      return;
    }

    // Check if any images failed to upload
    const failedImages = images.filter(img => img.uploadError);
    if (failedImages.length > 0) {
      toast.error('Some images failed to upload. Please remove them or try again.');
      return;
    }

    // Get only successfully uploaded Cloudinary URLs
    const cloudinaryUrls = images
      .filter(img => img.cloudinaryUrl)
      .map(img => img.cloudinaryUrl as string);

    createReview(
      {
        restaurantId,
        rating,
        comment: comment.trim(),
        images: cloudinaryUrls,
      },
      {
        onSuccess: () => {
          // Clean up object URLs
          images.forEach(img => URL.revokeObjectURL(img.preview));

          // Reset form
          setRating(0);
          setComment('');
          setImages([]);

          // Show success toast
          toast.success('Review posted successfully! ✨');
        },
        onError: (error: any) => {
          toast.error('Lỗi khi tạo đánh giá', {
            position: 'top-right',
            autoClose: 2500,
          });

          if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
              toast.error('You do not have permission to post reviews.');
            } else if (error.response?.status === 401) {
              toast.error('Your session has expired. Please log in again.');
              setIsAuthenticated(false);
              router.push('/login');
            } else if (error.response?.status === 400) {
              toast.error('Invalid review data.');
            } else {
              toast.error('Failed to post review. Please try again.');
            }
          } else {
            toast.error('An unexpected error occurred.');
          }
        },
      }
    );
  };

  const handleCancel = () => {
    // Clean up object URLs
    images.forEach(img => URL.revokeObjectURL(img.preview));

    setComment('');
    setImages([]);
    setRating(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="flex-1">
          <p className="text-blue-900 font-medium">Log in to post a review</p>
          <p className="text-blue-700 text-sm">You must be logged in to share your experience.</p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm whitespace-nowrap ml-4"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Compact Capsule Review Bar */}
      <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-blue-50 border-2 border-[#44BACA] rounded-full transition-all duration-300 hover:border-[#2B7A8E]">
        {/* Star Rating Selector - Left */}
        <div className="flex items-center gap-1 shrink-0">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1 transition-transform hover:scale-110 active:scale-95"
              title={`${value} star${value !== 1 ? 's' : ''}`}
            >
              <Star
                size={18}
                className={`transition-colors ${value <= rating
                  ? 'fill-[#44BACA] text-[#44BACA]'
                  : 'text-gray-300 hover:text-gray-400'
                  }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-xs font-semibold text-[#44BACA] ml-1">{rating}</span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Input Field - Center */}
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a review..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base min-w-0"
        />

        {/* Image Upload Icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload images"
          className="p-2 shrink-0 rounded-full hover:bg-white/50 transition-colors"
        >
          <ImagePlus size={18} className="text-gray-600 hover:text-[#44BACA]" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Send Button - Right */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !rating || !comment.trim() || images.some(img => img.isUploading)}
          className="p-2 shrink-0 rounded-full bg-[#44BACA] text-white hover:bg-[#2B7A8E] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95"
          title="Send review"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="mt-3 ml-4 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
              <img src={image.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />

              {/* Upload Status Overlay */}
              {image.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={20} className="text-white animate-spin" />
                </div>
              )}

              {/* Upload Error Overlay */}
              {image.uploadError && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                  <AlertCircle size={16} className="text-white" />
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={image.isUploading}
                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}