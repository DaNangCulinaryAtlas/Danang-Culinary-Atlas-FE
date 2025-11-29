'use client';

import { ReactNode, useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from '@/../public/locales/en/common.json';
import viCommon from '@/../public/locales/vi/common.json';

interface I18nProviderProps {
    children: ReactNode;
    initialLanguage?: 'vi' | 'en';
}

// Initialize i18next only once
let i18nInitialized = false;

export function I18nProvider({ children, initialLanguage = 'vi' }: I18nProviderProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Initialize i18next
        if (!i18nInitialized) {
            i18next
                .use(LanguageDetector)
                .use(initReactI18next)
                .init({
                    resources: {
                        vi: { common: viCommon },
                        en: { common: enCommon },
                    },
                    fallbackLng: 'vi',
                    defaultNS: 'common',
                    interpolation: {
                        escapeValue: false,
                    },
                    detection: {
                        order: ['localStorage', 'navigator'],
                        caches: ['localStorage'],
                    },
                    react: {
                        useSuspense: false,
                    },
                });
            i18nInitialized = true;
        }

        // Set language from localStorage or use initial language
        const savedLanguage = (localStorage.getItem('language') || initialLanguage) as 'vi' | 'en';
        i18next.changeLanguage(savedLanguage).then(() => {
            setIsReady(true);
        });
    }, [initialLanguage]);

    if (!isReady) {
        return <>{children}</>;
    }

    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
