'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import MobileMenu from './components/Menu';
import ProfileModal from './components/ProfileModal';
import { useAppSelector } from '@/hooks/useRedux';
import { CircleUser } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user } = useAppSelector((state) => state.auth)
  const [modalProfileOpen, setModalProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Chỉ render phần phụ thuộc vào user sau khi component đã mount trên client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="bg-white fixed top-0 z-50 w-full border-b backdrop-blur mb-4 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex justify-between items-center h-14 gap-4">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="hidden xl:block font-nicomoji text-2xl font-regular whitespace-nowrap">
              Danang Culinary Atlas
            </span>
          </Link>

          {/* Right: Nav - Hidden on mobile, shown on md+ */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 flex-shrink-0">
            <Link
              href="/atlas"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Atlas
            </Link>
            <Link
              href="/about"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              About us
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="hidden lg:inline">Popular Restaurants</span>
              <span className="lg:hidden">Restaurants</span>
            </Link>
            <Link
              href="/packages"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="hidden lg:inline">Our Packages</span>
              <span className="lg:hidden">Packages</span>
            </Link>
            {!mounted ? (
              // Render placeholder giống với server để tránh hydration mismatch
              <Button asChild className="ml-2 bg-[#FFDA32] w-20 lg:w-[90px] h-9 lg:h-[40px] text-black font-mulish font-extrabold hover:bg-[#e6c229] transition-colors rounded-none whitespace-nowrap">
                <Link href="/login">
                  Login
                </Link>
              </Button>
            ) : user ? (
              <Button
                variant="ghost"
                onClick={() => setModalProfileOpen(true)}
                className="p-0 h-auto hover:bg-transparent"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#69C3CF] hover:border-[#57a8ae] transition-colors"
                  />
                ) : (
                  <CircleUser color='#495560' size={36} />
                )}
              </Button>
            ) : (
              <Button asChild className="ml-2 bg-[#FFDA32] w-20 lg:w-[90px] h-9 lg:h-[40px] text-black font-mulish font-extrabold hover:bg-[#e6c229] transition-colors rounded-none whitespace-nowrap">
                <Link href="/login">
                  Login
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={modalProfileOpen}
        onClose={() => setModalProfileOpen(false)}
      />
    </>
  );
}