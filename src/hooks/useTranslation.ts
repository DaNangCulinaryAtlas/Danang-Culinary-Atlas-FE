import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { useCallback, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setLanguage } from '@/stores/auth';

export function useTranslation(namespace: string = 'common') {
    const translation = useTranslationOriginal(namespace);
    const { i18n, t: tOriginal } = translation;
    const dispatch = useAppDispatch();
    const { ui } = useAppSelector((state) => state.auth);

    // Sync i18next with Redux state when Redux state changes (but not when user explicitly changes language)
    useEffect(() => {
        if (ui.language && i18n.language !== ui.language) {
            i18n.changeLanguage(ui.language);
        }
    }, [ui.language, i18n]);

    const changeLanguage = useCallback((lang: 'vi' | 'en') => {
        i18n.changeLanguage(lang);
        dispatch(setLanguage(lang));
        localStorage.setItem('language', lang);
    }, [i18n, dispatch]);

    // Use Redux state if available, otherwise fallback to i18n.language
    const currentLanguage = useMemo(() => {
        return ui.language || (i18n.language as 'vi' | 'en') || 'vi';
    }, [ui.language, i18n.language]);

    // Wrap t function to ensure it always returns a string and handles missing keys gracefully
    const t = useCallback((key: string, options?: any): string => {
        if (!i18n.isInitialized) {
            return key; // Return key if i18n not initialized yet
        }
        // Use tOriginal directly - it already handles namespace from useTranslationOriginal(namespace)
        const result = tOriginal(key, options);
        // Ensure result is always a string
        if (typeof result === 'string') {
            return result;
        }
        // If result is not a string (shouldn't happen), return the key
        return key;
    }, [tOriginal, i18n.isInitialized, i18n.language]);

    // Force re-render when language changes by including i18n.language in the return
    return {
        ...translation,
        t,
        i18n,
        changeLanguage,
        currentLanguage,
        // Include language to trigger re-render when it changes
        language: i18n.language,
        ready: i18n.isInitialized,
    };
}
