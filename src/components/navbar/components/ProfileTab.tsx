'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, User, Shield, Calendar, Users, Save, Loader2, Upload, Camera } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchUserProfile, updateUserProfile, uploadAvatar } from '@/stores/auth/action';
import { toast } from 'react-toastify';

interface ProfileTabProps {
    user: {
        accountId?: string;
        email?: string;
        fullName?: string | null;
        avatarUrl?: string;
        roles: string[];
        status?: string;
        dob?: string | null;
        gender?: string | null;
    } | null;
}

export default function ProfileTab({ user }: ProfileTabProps) {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        avatarUrl: user?.avatarUrl || '',
    });

    // Fetch profile data when component mounts
    useEffect(() => {
        if (user?.roles && user.roles.length > 0) {
            // Use the first role to determine which endpoint to call
            const primaryRole = user.roles[0];
            dispatch(fetchUserProfile(primaryRole));
        }
    }, [dispatch, user?.roles]);

    // Update form data when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                dob: user.dob || '',
                gender: user.gender || '',
                avatarUrl: user.avatarUrl || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const resultAction = await dispatch(uploadAvatar(file));

            if (uploadAvatar.fulfilled.match(resultAction)) {
                // Update form data with the secure URL from Cloudinary
                setFormData((prev) => ({
                    ...prev,
                    avatarUrl: resultAction.payload,
                }));
                toast.success('Avatar uploaded successfully!');
            } else if (uploadAvatar.rejected.match(resultAction)) {
                toast.error(resultAction.payload as string || 'Failed to upload avatar');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('An error occurred while uploading avatar');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.roles || user.roles.length === 0) return;

        setIsSaving(true);
        const primaryRole = user.roles[0];

        try {
            await dispatch(updateUserProfile({
                role: primaryRole,
                data: {
                    fullName: formData.fullName || undefined,
                    dob: formData.dob || undefined,
                    gender: formData.gender || undefined,
                    avatarUrl: formData.avatarUrl || undefined,
                }
            })).unwrap();
            toast.success('Cập nhật thông tin mới thành công', {
                position: 'top-right',
                autoClose: 2500,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original user data
        setFormData({
            fullName: user?.fullName || '',
            dob: user?.dob || '',
            gender: user?.gender || '',
            avatarUrl: user?.avatarUrl || '',
        });
        setIsEditing(false);
    };

    if (loading && !user?.accountId) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#69C3CF]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-[120px] h-[120px]">
                    {formData.avatarUrl ? (
                        <Image
                            src={formData.avatarUrl}
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-[#69C3CF] object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-[#69C3CF] flex items-center justify-center text-white text-4xl font-bold border-4 border-[#69C3CF]">
                            {formData.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Camera overlay when editing - only shows overlay, not duplicate image */}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            disabled={isUploading}
                            className="absolute inset-0 rounded-full bg-opacity-100 flex items-center justify-center transition-all hover:bg-opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Change avatar"
                        >
                            <Image
                                src={formData.avatarUrl}
                                alt="Profile"
                                width={120}
                                height={120}
                                className="rounded-full border-4 border-[#69C3CF] object-cover w-full h-full"
                            />
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            ) : (
                                <Camera className="w-8 h-8 text-white" />
                            )}
                        </button>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Upload button when editing */}
                {isEditing && (
                    <Button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={isUploading}
                        variant="outline"
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Avatar
                            </>
                        )}
                    </Button>
                )}
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
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-100' : ''}
                        placeholder="Enter your full name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="inline-block mr-2" size={16} />
                        Date of Birth
                    </label>
                    <Input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-100' : ''}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="inline-block mr-2" size={16} />
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#69C3CF] ${!isEditing ? 'bg-gray-100' : ''
                            }`}
                    >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                {user?.status && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.status}
                        </span>
                    </div>
                )}

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

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
                {!isEditing ? (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-[#69C3CF] hover:bg-[#57a8ae] text-white"
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="flex-1"
                            disabled={isSaving || isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-[#69C3CF] hover:bg-[#57a8ae] text-white"
                            disabled={isSaving || isUploading}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
