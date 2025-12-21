"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    UtensilsCrossed,
    MapPinOff,
    ChefHat,
    Home,
    ArrowLeft,
    Soup,
} from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full text-center">
                {/* Animated Icons */}
                <div className="relative mb-8">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="animate-bounce delay-100">
                            <UtensilsCrossed className="w-16 h-16 md:w-20 md:h-20 text-[#69C3CF]" />
                        </div>
                        <div className="animate-bounce delay-200">
                            <ChefHat className="w-20 h-20 md:w-24 md:h-24 text-[#5AB4C0]" />
                        </div>
                        <div className="animate-bounce delay-300">
                            <Soup className="w-16 h-16 md:w-20 md:h-20 text-[#7DD3DF]" />
                        </div>
                    </div>
                    <MapPinOff className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto animate-pulse" />
                </div>

                {/* Error Code */}
                <div className="mb-6">
                    <h1 className="text-8xl md:text-9xl font-bold text-[#69C3CF] mb-2 font-poppins">
                        404
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-[#69C3CF] to-[#5AB4C0] mx-auto rounded-full"></div>
                </div>

                {/* Main Message */}
                <div className="mb-8 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-volkhov">
                        Trang Không Tồn Tại!
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-open-sans leading-relaxed">
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ để khám phá bản đồ ẩm thực Đà Nẵng!
                    </p>
                </div>

                {/* Vietnamese Culinary Decorative Element */}
                <div className="mb-8 flex justify-center items-center gap-3 text-4xl">
                    <span className="animate-pulse">🍜</span>
                    <span className="animate-pulse delay-100">🦐</span>
                    <span className="animate-pulse delay-200">🥖</span>
                    <span className="animate-pulse delay-300">🍲</span>
                    <span className="animate-pulse delay-400">🥢</span>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#69C3CF] to-[#5AB4C0] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-[#5AB4C0] hover:to-[#4AA5B0] transform hover:scale-105 transition-all duration-300 font-poppins"
                    >
                        <Home className="w-5 h-5 group-hover:animate-bounce" />
                        Về Trang Chủ
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 border-2 border-[#69C3CF] font-poppins"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Quay Lại
                    </button>
                </div>

                {/* Footer Message */}
                <div className="mt-12 pt-8 border-t border-gray-300">
                    <p className="text-sm text-gray-500 font-open-sans">
                        Hãy cùng khám phá những hương vị tuyệt vời của Đà Nẵng! 🌴
                    </p>
                </div>
            </div>

            {/* Custom CSS for animation delays */}
            <style jsx>{`
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
        </div>
    );
}
