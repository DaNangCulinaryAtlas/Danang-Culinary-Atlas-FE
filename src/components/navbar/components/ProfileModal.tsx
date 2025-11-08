'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, User, Lock, Settings, LogOut, Mail, Shield } from 'lucide-react';
import { changePasswordAuth } from '@/services/auth';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/stores/auth';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'settings'>('profile');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    if (!isOpen) return null;

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setIsChangingPassword(true);
        try {
            const response = await changePasswordAuth({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.success) {
                setPasswordSuccess('Password changed successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordError(response.message || 'Failed to change password');
            }
        } catch (error) {
            setPasswordError('An error occurred while changing password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        onClose();
        router.push('/login');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'profile'
                            ? 'text-[#69C3CF] border-b-2 border-[#69C3CF]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <User className="inline-block mr-2" size={18} />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'password'
                            ? 'text-[#69C3CF] border-b-2 border-[#69C3CF]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Lock className="inline-block mr-2" size={18} />
                        Password
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'settings'
                            ? 'text-[#69C3CF] border-b-2 border-[#69C3CF]'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Settings className="inline-block mr-2" size={18} />
                        Settings
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                {user?.avatarUrl ? (
                                    <Image
                                        src={user.avatarUrl}
                                        alt="Profile"
                                        width={120}
                                        height={120}
                                        className="rounded-full border-4 border-[#69C3CF]"
                                    />
                                ) : (
                                    <div className="w-30 h-30 rounded-full bg-[#69C3CF] flex items-center justify-center text-white text-4xl font-bold">
                                        {user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <Button className="bg-[#69C3CF] hover:bg-[#57a8ae] text-white">
                                    Change Avatar
                                </Button>
                            </div>

                            {/* User Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Mail className="inline-block mr-2" size={16} />
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <User className="inline-block mr-2" size={16} />
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={user?.fullName || 'Not set'}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Shield className="inline-block mr-2" size={16} />
                                        Roles
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.roles.map((role) => (
                                            <span
                                                key={role}
                                                className="px-3 py-1 bg-[#69C3CF] text-white rounded-full text-sm font-semibold"
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                                <p className="text-sm text-blue-700">
                                    <Lock className="inline-block mr-2" size={16} />
                                    Please enter your current password and choose a new one.
                                </p>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
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
                                        New Password
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
                                        Confirm New Password
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

                                {passwordError && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                        <p className="text-sm text-red-700">{passwordError}</p>
                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                        <p className="text-sm text-green-700">{passwordSuccess}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-[#69C3CF] hover:bg-[#57a8ae] text-white"
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
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
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </Button>
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}