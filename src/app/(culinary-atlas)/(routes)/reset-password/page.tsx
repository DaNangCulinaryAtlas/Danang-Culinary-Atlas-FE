'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useResetPasswordMutation } from '@/hooks/mutations/useAuthMutations';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations/auth';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ResetPassword() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetPasswordMutation = useResetPasswordMutation();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            // Redirect to forgot-password if no token
            router.push('/forgot-password');
        }
    }, [searchParams, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Set token value when it's available
    useEffect(() => {
        if (token) {
            setValue('token', token);
        }
    }, [token, setValue]);

    const onSubmit = (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate(data, {
            onSuccess: () => {
                // Redirect to login after successful password reset
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            },
        });
    };

    if (!token) {
        return null; // Loading or redirecting
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-0">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl shadow-xl border rounded-lg overflow-hidden">

                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-400">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/login-image.png"
                            alt="Reset Password Image"
                            fill
                            sizes="(max-width: 1024px) 0vw, 50vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-start items-center w-full p-8 md:p-12 text-white">
                        <h1 className="font-nicomoji text-[20px] mb-4 md:mb-6 leading-tight whitespace-nowrap">
                            Danang Culinary Atlas
                        </h1>
                        <p className="text-sm md:text-base font-mulish leading-relaxed max-w-xs text-center">
                            {t('auth.resetPassword.description')}
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-white">
                    <div className="w-full max-w-md space-y-6">

                        {/* Header */}
                        <div className="text-center mb-4">
                            <h2 className="font-mulish font-extrabold text-[#69C3CF] text-4xl sm:text-5xl">
                                {t('auth.resetPassword.title')}
                            </h2>
                            <p className="font-mulish text-sm text-[#000000] mt-1">
                                {t('auth.resetPassword.subtitle')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Error/Success Area - Fixed Height */}
                            <div className="h-[3.25rem] flex items-start">
                                {resetPasswordMutation.error ? (
                                    <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm animate-fadeIn">
                                        {resetPasswordMutation.error.message}
                                    </div>
                                ) : resetPasswordMutation.isSuccess ? (
                                    <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm animate-fadeIn">
                                        {t('auth.resetPassword.successMessage')}
                                    </div>
                                ) : (
                                    <div className="w-full opacity-0 pointer-events-none">
                                        <div className="px-4 py-2">Placeholder</div>
                                    </div>
                                )}
                            </div>

                            {/* Hidden token field */}
                            <input type="hidden" {...register('token')} />

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-bold text-[#69C3CF] mb-1 font-poppins">
                                    {t('auth.resetPassword.newPasswordLabel')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('newPassword')}
                                        placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                                        className="pl-10 pr-10 h-12 border-[#69C3CF] font-poppins text-sm"
                                        disabled={resetPasswordMutation.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-red-500 text-xs mt-1 font-poppins">{errors.newPassword.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-bold text-[#69C3CF] mb-1 font-poppins">
                                    {t('auth.resetPassword.confirmPasswordLabel')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                                        className="pl-10 pr-10 h-12 border-[#69C3CF] font-poppins text-sm"
                                        disabled={resetPasswordMutation.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1 font-poppins">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs font-poppins text-blue-800 font-semibold mb-1">
                                    {t('auth.resetPassword.requirements.title')}
                                </p>
                                <ul className="text-xs font-poppins text-blue-700 space-y-0.5 list-disc list-inside">
                                    <li>{t('auth.resetPassword.requirements.minLength')}</li>
                                    <li>{t('auth.resetPassword.requirements.uppercase')}</li>
                                    <li>{t('auth.resetPassword.requirements.lowercase')}</li>
                                    <li>{t('auth.resetPassword.requirements.number')}</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={resetPasswordMutation.isPending || resetPasswordMutation.isSuccess}
                                className="w-full h-11 bg-[#69C3CF] hover:bg-[#5AB3BF] text-white font-poppins text-sm font-medium rounded-md disabled:opacity-50"
                            >
                                {resetPasswordMutation.isPending ? t('auth.resetPassword.submitting').toUpperCase() : t('auth.resetPassword.submitButton').toUpperCase()}
                            </Button>
                        </form>

                        {/* Back to Login Link */}
                        <p className="text-center text-xs font-mulish text-gray-600">
                            {t('auth.resetPassword.rememberPassword')}{' '}
                            <Link href="/login" className="text-[#69C3CF] hover:text-[#5AB3BF] font-semibold">
                                {t('auth.resetPassword.loginNow')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
