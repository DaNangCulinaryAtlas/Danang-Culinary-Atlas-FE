'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, User, Lock, Settings, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/stores/auth';
import ProfileTab from './ProfileTab';
import ChangePasswordTab from './ChangePasswordTab';
import SettingsTab from './SettingsTab';
import { useTranslation } from 'react-i18next';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    colorScheme?: {
        primary: string;
        primaryBorder: string;
        primaryBg: string;
        footerBg: string;
    };
    title?: string;
    redirectAfterLogout?: string;
}

export default function ProfileModal({
    isOpen,
    onClose,
    colorScheme = {
        primary: '#69C3CF',
        primaryBorder: '#69C3CF',
        primaryBg: '#e0f2f4',
        footerBg: '#f9fafb'
    },
    title,
    redirectAfterLogout = '/'
}: ProfileModalProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'settings'>('profile');

    if (!isOpen) return null;

    const handleLogout = () => {
        dispatch(logout());
        onClose();
        router.push(redirectAfterLogout);
    };

    const displayTitle = title || t('profile.title');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 border-b flex-shrink-0"
                    style={{ borderColor: colorScheme.primaryBg }}
                >
                    <h2 className="text-2xl font-bold" style={{ color: colorScheme.primary }}>
                        {displayTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b flex-shrink-0" style={{ borderColor: colorScheme.primaryBg }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'profile'
                            ? 'border-b-2'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        style={
                            activeTab === 'profile'
                                ? { color: colorScheme.primary, borderColor: colorScheme.primaryBorder }
                                : {}
                        }
                    >
                        <User className="inline-block mr-2" size={18} />
                        {t('profile.title')}
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'password'
                            ? 'border-b-2'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        style={
                            activeTab === 'password'
                                ? { color: colorScheme.primary, borderColor: colorScheme.primaryBorder }
                                : {}
                        }
                    >
                        <Lock className="inline-block mr-2" size={18} />
                        {t('profile.changePassword')}
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'settings'
                            ? 'border-b-2'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        style={
                            activeTab === 'settings'
                                ? { color: colorScheme.primary, borderColor: colorScheme.primaryBorder }
                                : {}
                        }
                    >
                        <Settings className="inline-block mr-2" size={18} />
                        {t('profile.settings')}
                    </button>
                </div>

                {/* Content - Fixed height to prevent layout shift */}
                <div className="p-6 overflow-y-auto h-[400px]">
                    {activeTab === 'profile' && <ProfileTab user={user} />}
                    {activeTab === 'password' && <ChangePasswordTab />}
                    {activeTab === 'settings' && <SettingsTab />}
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-between p-6 border-t flex-shrink-0"
                    style={{
                        borderColor: colorScheme.primaryBg,
                        background: colorScheme.footerBg
                    }}
                >
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        {t('profile.logout')}
                    </Button>
                    <Button onClick={onClose} variant="outline">
                        {t('profile.cancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
}