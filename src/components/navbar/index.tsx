'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import MobileMenu from './components/Menu';
import ProfileModal from './components/ProfileModal';
import { useAppSelector } from '@/hooks/useRedux';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const [modalProfileOpen, setModalProfileOpen] = useState(false);

  // 🔥 Fix hydration error
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔥 Fix invalid URL for next/image
  const avatar =
    user?.avatarUrl && (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('/'))
      ? user.avatarUrl
      : '/images/default-avatar.webp';

  return (
    <>
      <header className="bg-white fixed top-0 z-50 w-full border-b backdrop-blur mb-4 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex justify-between items-center h-14 gap-4">

          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="rounded-full object-contain"
                priority
              />
            </div>
            <span className="hidden xl:block font-nicomoji text-2xl font-regular whitespace-nowrap">
              Danang Culinary Atlas
            </span>
          </Link>

          {/* Right: Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 shrink-0">
            <Link
              href="/atlas"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t('navbar.atlas')}
            </Link>
            <Link
              href="/our-story"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t('navbar.aboutUs')}
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="hidden lg:inline">{t('navbar.popularRestaurants')}</span>
              <span className="lg:hidden">{t('navbar.restaurants')}</span>
            </Link>
            <Link
              href="/packages"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="hidden lg:inline">{t('navbar.ourPackages')}</span>
              <span className="lg:hidden">{t('navbar.packages')}</span>
            </Link>

            {/* 🔥 Render user only after client mount */}
            {isMounted && (
              user ? (
                <Button
                  variant="ghost"
                  onClick={() => setModalProfileOpen(true)}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#69C3CF] hover:border-[#57a8ae] transition-colors"
                  />
                </Button>
              ) : (
                <Link href="/login" className="ml-2">
                  <Button className="bg-[#FFDA32] w-20 lg:w-[90px] h-9 lg:h-10 text-black font-mulish font-extrabold hover:bg-[#e6c229] transition-colors rounded-none whitespace-nowrap">
                    {t('navbar.login')}
                  </Button>
                </Link>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          {isMounted && <MobileMenu />}
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
