'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { changePasswordAuth } from '@/services/auth';
import { toast } from 'react-toastify';

export default function ChangePasswordTab() {
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
            setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
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
                toast.success('Thay đổi mật khẩu thành công', {
                    position: 'top-right',
                    autoClose: 2500,
                });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordError(response.message || 'Thay đổi mật khẩu thất bại');
            }
        } catch (error) {
            setPasswordError('Có lỗi xảy ra. Vui lòng thử lại.');
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
                        Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu của bạn.
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
                        Mật khẩu hiện tại
                    </label>
                    <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        placeholder="Enter current password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mật khẩu mới
                    </label>
                    <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        placeholder="Enter new password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Xác nhận lại mật khẩu
                    </label>
                    <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-2 py-5 bg-[#69C3CF] hover:bg-[#57a8ae] text-white"
                    disabled={isChangingPassword}
                >
                    {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                </Button>
            </form>
        </div>
    );
}
