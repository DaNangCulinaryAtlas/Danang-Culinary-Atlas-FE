'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import MobileMenu from './components/Menu';
import ProfileModal from './components/ProfileModal';
import NotificationPanel from '@/components/notification/NotificationPanel';
import { useAppSelector } from '@/hooks/useRedux';
import { useTranslation } from 'react-i18next';
import { CircleUser, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/queries/useNotifications';

export default function Header() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth)
  const [modalProfileOpen, setModalProfileOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch notifications if user is logged in
  const { data: notificationsData } = useNotifications(10);
  const notifications = notificationsData?.pages.flatMap(page => page.content) || [];
  const unreadCount = user ? notifications.filter(n => !n.isRead).length : 0;

  // Chỉ render phần phụ thuộc vào user sau khi component đã mount trên client
  useEffect(() => {
    setMounted(true);
  }, []);
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
              href="/dishes"
              className="text-sm font-mulish font-semibold text-[#495560] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span className="hidden lg:inline">{t('navbar.popularDishes')}</span>
              <span className="lg:hidden">{t('navbar.dishes')}</span>
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
            {user ? (
              <>
                {/* Notification Bell */}
                <button
                  onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                  className="notification-bell relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Avatar */}
                <Button
                  variant="ghost"
                  onClick={() => setModalProfileOpen(true)}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={avatar}
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-[#69C3CF] hover:border-[#57a8ae] transition-colors"
                    />
                  ) : (
                    <CircleUser color='#495560' size={36} />
                  )}
                </Button>
              </>
            ) : (
              <Button asChild className="ml-2 bg-[#FFDA32] w-20 lg:w-[90px] h-9 lg:h-[40px] text-black font-mulish font-extrabold hover:bg-[#e6c229] transition-colors rounded-none whitespace-nowrap">
                <Link href="/login">
                  Login
                </Link>
              </Button>
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

      {/* Notification Panel */}
      {user && (
        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      )}
    </>
  );
}
