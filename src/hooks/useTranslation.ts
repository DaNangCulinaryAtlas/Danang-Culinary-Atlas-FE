import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setLanguage } from '@/stores/auth';

export function useTranslation() {
    const { i18n } = useTranslationOriginal();
    const dispatch = useAppDispatch();
    const { ui } = useAppSelector((state) => state.auth);

    const changeLanguage = useCallback((lang: 'vi' | 'en') => {
        i18n.changeLanguage(lang);
        dispatch(setLanguage(lang));
        localStorage.setItem('language', lang);
    }, [i18n, dispatch]);

    return {
        ...useTranslationOriginal(),
        changeLanguage,
        currentLanguage: ui.language,
    };
}
