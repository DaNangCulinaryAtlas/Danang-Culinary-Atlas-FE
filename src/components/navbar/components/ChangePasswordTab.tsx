'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { changePasswordAuth } from '@/services/auth';
import { toast } from 'react-toastify';
import { useTranslation } from '@/hooks/useTranslation';

export default function ChangePasswordTab() {
    const { t } = useTranslation();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError(t('auth.changePassword.passwordMismatch'));
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError(t('auth.changePassword.passwordMinLength'));
            return;
        }

        setIsChangingPassword(true);
        try {
            const response = await changePasswordAuth({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            if (response.success) {
                toast.success(t('auth.changePassword.success'), {
                    position: 'top-right',
                    autoClose: 2500,
                });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordError(response.message || t('auth.changePassword.error'));
            }
        } catch (error) {
            setPasswordError(t('auth.changePassword.errorOccurred'));
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            {!passwordError ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <p className="text-sm text-blue-700">
                        <Lock className="inline-block mr-2" size={16} />
                        {t('auth.changePassword.description')}
                    </p>
                </div>
            ): (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{passwordError}</p>
                </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('auth.changePassword.currentPassword')}
                    </label>
                    <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        placeholder={t('auth.changePassword.currentPasswordPlaceholder')}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('auth.changePassword.newPassword')}
                    </label>
                    <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        placeholder={t('auth.changePassword.newPasswordPlaceholder')}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('auth.changePassword.confirmPassword')}
                    </label>
                    <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        placeholder={t('auth.changePassword.confirmPasswordPlaceholder')}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-2 py-5 bg-[#69C3CF] hover:bg-[#57a8ae] text-white"
                    disabled={isChangingPassword}
                >
                    {isChangingPassword ? t('auth.changePassword.changing') : t('auth.changePassword.changeButton')}
                </Button>
            </form>
        </div>
    );
}
