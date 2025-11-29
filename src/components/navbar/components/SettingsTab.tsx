'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setLanguage } from '@/stores/auth';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export default function SettingsTab() {
    const dispatch = useAppDispatch();
    const { ui } = useAppSelector((state) => state.auth);
    const { t } = useTranslation();

    const handleLanguageChange = (lang: 'vi' | 'en') => {
        dispatch(setLanguage(lang));
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
                            checked={ui.language === 'vi'}
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
                            checked={ui.language === 'en'}
                            onChange={() => handleLanguageChange('en')}
                            className="w-5 h-5 text-[#69C3CF]"
                        />
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg">Account Settings</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-[#69C3CF]" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">Marketing Emails</p>
                            <p className="text-sm text-gray-500">Receive promotional content</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-[#69C3CF]" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add extra security to your account</p>
                        </div>
                        <Button variant="outline" size="sm">
                            Enable
                        </Button>
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg">Privacy</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">Profile Visibility</p>
                            <p className="text-sm text-gray-500">Who can see your profile</p>
                        </div>
                        <select className="border rounded px-3 py-1 text-sm">
                            <option>Public</option>
                            <option>Private</option>
                            <option>Friends Only</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                            <p className="font-semibold text-gray-700">Show Online Status</p>
                            <p className="text-sm text-gray-500">Let others see when you're online</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-[#69C3CF]" defaultChecked />
                    </div>
                </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-800 text-lg mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                    Irreversible actions that affect your account
                </p>
                <Button variant="destructive" className="w-full">
                    Delete Account
                </Button>
            </div>
        </div>
    );
}
