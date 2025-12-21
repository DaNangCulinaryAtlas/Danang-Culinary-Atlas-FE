'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageSwitcherProps {
    variant?: 'dropdown' | 'inline';
}

export default function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
    const { t, changeLanguage, currentLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen && variant === 'dropdown') {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, variant]);

    const handleLanguageChange = (lang: 'vi' | 'en') => {
        changeLanguage(lang);
        setIsOpen(false);
    };

    const getCurrentLanguageLabel = () => {
        return currentLanguage === 'vi' ? 'VI' : 'EN';
    };

    // Inline variant for mobile menu
    if (variant === 'inline') {
        return (
            <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">{t('language.title')}</p>
                <button
                    onClick={() => handleLanguageChange('vi')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                        currentLanguage === 'vi' 
                            ? 'bg-[#e0f2f4] text-[#69C3CF] border-2 border-[#69C3CF]' 
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    <div>
                        <p className="font-semibold">{t('language.vietnamese')}</p>
                        <p className="text-xs text-gray-500">Vietnamese</p>
                    </div>
                    {currentLanguage === 'vi' && (
                        <span className="text-[#69C3CF] text-lg">✓</span>
                    )}
                </button>
                <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                        currentLanguage === 'en' 
                            ? 'bg-[#e0f2f4] text-[#69C3CF] border-2 border-[#69C3CF]' 
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    <div>
                        <p className="font-semibold">{t('language.english')}</p>
                        <p className="text-xs text-gray-500">English</p>
                    </div>
                    {currentLanguage === 'en' && (
                        <span className="text-[#69C3CF] text-lg">✓</span>
                    )}
                </button>
            </div>
        );
    }

    // Dropdown variant for desktop navbar
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm font-semibold text-[#495560]"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                        onClick={() => handleLanguageChange('vi')}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            currentLanguage === 'vi' ? 'bg-[#e0f2f4] text-[#69C3CF]' : 'text-gray-700'
                        }`}
                    >
                        <div>
                            <p className="font-semibold">{t('language.vietnamese')}</p>
                            <p className="text-xs text-gray-500">Vietnamese</p>
                        </div>
                        {currentLanguage === 'vi' && (
                            <span className="text-[#69C3CF]">✓</span>
                        )}
                    </button>
                    <button
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            currentLanguage === 'en' ? 'bg-[#e0f2f4] text-[#69C3CF]' : 'text-gray-700'
                        }`}
                    >
                        <div>
                            <p className="font-semibold">{t('language.english')}</p>
                            <p className="text-xs text-gray-500">English</p>
                        </div>
                        {currentLanguage === 'en' && (
                            <span className="text-[#69C3CF]">✓</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

