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
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<{
        fullName?: string;
        dob?: string;
        gender?: string;
    }>({});
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
        // Clear error for this field when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
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

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        // Validate fullName
        if (formData.fullName && formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Tên phải có ít nhất 2 ký tự';
        }

        // Validate dob (must be in the past)
        if (formData.dob) {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dobDate >= today) {
                newErrors.dob = 'Ngày sinh phải là ngày trong quá khứ';
            }

            // Check if age is reasonable (at least 5 years old, max 150 years)
            const age = today.getFullYear() - dobDate.getFullYear();
            if (age < 5) {
                newErrors.dob = 'Tuổi phải từ 5 tuổi trở lên';
            } else if (age > 150) {
                newErrors.dob = 'Ngày sinh không hợp lệ';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!user?.roles || user.roles.length === 0) return;

        // Validate form before submitting
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

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
            setErrors({});
        } catch (error: any) {
            console.error('Failed to update profile:', error);

            // Handle 400 errors from server
            if (error?.response?.status === 400 || error?.status === 400) {
                const errorMessage = error?.response?.data?.message || error?.message || 'Thông tin không hợp lệ';

                // Try to parse specific field errors
                if (errorMessage.includes('Ngày sinh')) {
                    setErrors(prev => ({ ...prev, dob: errorMessage }));
                } else if (errorMessage.includes('Tên') || errorMessage.includes('fullName')) {
                    setErrors(prev => ({ ...prev, fullName: errorMessage }));
                } else if (errorMessage.includes('gender') || errorMessage.includes('giới tính')) {
                    setErrors(prev => ({ ...prev, gender: errorMessage }));
                }

                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 4000,
                });
            } else {
                toast.error('Cập nhật thất bại. Vui lòng thử lại sau.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
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
        setErrors({});
        setIsEditing(false);
    };

    // Helper function to validate URL
    const isValidUrl = (url: string): boolean => {
        if (!url || typeof url !== 'string') return false;
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return false;

        // Check if it starts with http, https, or / (relative path)
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('/')) {
            try {
                // For relative paths, use a dummy base
                if (trimmedUrl.startsWith('/')) {
                    return true;
                }
                new URL(trimmedUrl);
                return true;
            } catch {
                return false;
            }
        }
        return false;
    };

    const avatarUrl = isValidUrl(formData.avatarUrl) ? formData.avatarUrl : null;

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-[120px] h-[120px]">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
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
                    {isEditing && avatarUrl && (
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            disabled={isUploading}
                            className="absolute inset-0 rounded-full bg-opacity-100 flex items-center justify-center transition-all hover:bg-opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Change avatar"
                        >
                            <Image
                                src={avatarUrl}
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
                        className={!isEditing ? 'bg-gray-100' : errors.fullName ? 'border-red-500' : ''}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
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
                        className={!isEditing ? 'bg-gray-100' : errors.dob ? 'border-red-500' : ''}
                    />
                    {errors.dob && (
                        <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                    )}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#69C3CF] ${!isEditing ? 'bg-gray-100' : errors.gender ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
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
