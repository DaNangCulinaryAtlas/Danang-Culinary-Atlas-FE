"use client";
import Image from "next/image";

const galleryImages = [
  "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=600&fit=crop",
];

export default function GallerySection() {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="text-center md:text-left max-w-2xl">
          <h2 className="text-3xl font-volkhov font-bold text-[#1ABBB4] mb-2">
            From The Gallery
          </h2>
          <p className="text-gray-600 font-mulish">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit
          </p>
        </div>

        <button className="mt-6 md:mt-0 bg-[#1ABBB4] hover:bg-[#17A29D] text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 shadow-md">
          View All Images
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryImages.map((src, index) => (
            <div
            key={index}
            className="relative w-full h-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
            <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
            />
            </div>
        ))}
        </div>

    </section>
  );
}
