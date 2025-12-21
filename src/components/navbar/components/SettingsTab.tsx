'use client';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export default function SettingsTab() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language || 'vi';

    const handleLanguageChange = (lang: 'vi' | 'en') => {
        i18next.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg">{t('language.title')}</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">Tiếng Việt</p>
                            <p className="text-sm text-gray-500">Vietnamese</p>
                        </div>
                        <input
                            type="radio"
                            name="language"
                            value="vi"
                            checked={currentLanguage === 'vi'}
                            onChange={() => handleLanguageChange('vi')}
                            className="w-5 h-5 text-[#69C3CF]"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">English</p>
                            <p className="text-sm text-gray-500">English</p>
                        </div>
                        <input
                            type="radio"
                            name="language"
                            value="en"
                            checked={currentLanguage === 'en'}
                            onChange={() => handleLanguageChange('en')}
                            className="w-5 h-5 text-[#69C3CF]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
