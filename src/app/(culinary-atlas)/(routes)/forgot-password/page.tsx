'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft } from 'lucide-react';
import { useForgotPasswordMutation } from '@/hooks/mutations/useAuthMutations';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [emailSent, setEmailSent] = useState(false);
    const forgotPasswordMutation = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const emailValue = watch('email');

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(
            { ...data, platform: 'web' },
            {
                onSuccess: () => {
                    setEmailSent(true);
                },
            }
        );
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-0">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl shadow-xl border rounded-lg overflow-hidden">

                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-400">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/login-image.png"
                            alt="Forgot Password Image"
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
                            {t('auth.forgotPassword.description')}
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-white">
                    <div className="w-full max-w-md space-y-6">

                        {!emailSent ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <h2 className="font-mulish font-extrabold text-[#69C3CF] text-4xl sm:text-5xl">
                                        {t('auth.forgotPassword.title')}
                                    </h2>
                                    <p className="font-mulish text-sm text-[#000000] mt-1">
                                        {t('auth.forgotPassword.subtitle')}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                    {/* Error Area - Fixed Height */}
                                    <div className="h-[3.25rem] flex items-start">
                                        {forgotPasswordMutation.error ? (
                                            <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm animate-fadeIn">
                                                {forgotPasswordMutation.error.message}
                                            </div>
                                        ) : (
                                            <div className="w-full opacity-0 pointer-events-none">
                                                <div className="px-4 py-2">Placeholder</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#69C3CF] mb-1 font-poppins">
                                            {t('auth.forgotPassword.emailLabel')}
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                type="email"
                                                {...register('email')}
                                                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                                                className="pl-10 h-12 border-[#69C3CF] font-poppins text-sm"
                                                disabled={forgotPasswordMutation.isPending}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1 font-poppins">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={forgotPasswordMutation.isPending}
                                        className="w-full h-11 bg-[#69C3CF] hover:bg-[#5AB3BF] text-white font-poppins text-sm font-medium rounded-md disabled:opacity-50"
                                    >
                                        {forgotPasswordMutation.isPending ? t('auth.forgotPassword.submitting').toUpperCase() : t('auth.forgotPassword.submitButton').toUpperCase()}
                                    </Button>
                                </form>

                                {/* Back to Login Link */}
                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 text-[#69C3CF] hover:text-[#5AB3BF] font-poppins text-sm font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        {t('auth.forgotPassword.backToLogin')}
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Success Message */}
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <h2 className="font-mulish font-extrabold text-[#69C3CF] text-3xl sm:text-4xl">
                                        {t('auth.forgotPassword.successTitle')}
                                    </h2>

                                    <p className="font-mulish text-sm text-gray-600 px-4">
                                        {t('auth.forgotPassword.successMessage')}
                                    </p>

                                    <p className="font-poppins font-semibold text-[#69C3CF] text-base">
                                        {emailValue}
                                    </p>

                                    <p className="font-mulish text-xs text-gray-500 px-4">
                                        {t('auth.forgotPassword.successNote')}
                                    </p>

                                    <div className="pt-4">
                                        <Button
                                            onClick={() => setEmailSent(false)}
                                            variant="outline"
                                            className="w-full h-11 border-[#69C3CF] text-[#69C3CF] hover:bg-[#E7F2F5] font-poppins text-sm font-medium"
                                        >
                                            {t('auth.forgotPassword.resendButton')}
                                        </Button>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center gap-2 text-[#69C3CF] hover:text-[#5AB3BF] font-poppins text-sm font-medium"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            {t('auth.forgotPassword.backToLogin')}
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
