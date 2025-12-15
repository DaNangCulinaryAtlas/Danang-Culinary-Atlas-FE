'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPasswordMutation } from '@/hooks/mutations/useAuthMutations';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations/auth';

interface ForgotPasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
    const { t } = useTranslation();
    const [emailSent, setEmailSent] = useState(false);
    const forgotPasswordMutation = useForgotPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
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

    const handleClose = () => {
        setEmailSent(false);
        reset();
        forgotPasswordMutation.reset();
        onOpenChange(false);
    };

    const handleResend = () => {
        setEmailSent(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                {!emailSent ? (
                    <>
                        {/* Form State */}
                        <DialogHeader className="px-6 pt-6 pb-4">
                            <DialogTitle className="text-2xl font-extrabold text-[#69C3CF] font-mulish">
                                {t('auth.forgotPassword.title')}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 font-mulish">
                                {t('auth.forgotPassword.subtitle')}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
                            {/* Error Area */}
                            {forgotPasswordMutation.error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                                    {forgotPasswordMutation.error.message}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-[#69C3CF] mb-2 font-poppins">
                                    {t('auth.forgotPassword.emailLabel')}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        {...register('email')}
                                        placeholder={t('auth.forgotPassword.emailPlaceholder')}
                                        className="pl-10 h-11 border-gray-300 focus:border-[#69C3CF] focus:ring-[#69C3CF] font-poppins"
                                        disabled={forgotPasswordMutation.isPending}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 font-poppins">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1 h-11 border-gray-300 hover:bg-gray-50 font-poppins"
                                    disabled={forgotPasswordMutation.isPending}
                                >
                                    {t('auth.forgotPassword.backToLogin')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={forgotPasswordMutation.isPending}
                                    className="flex-1 h-11 bg-[#69C3CF] hover:bg-[#5AB3BF] text-white font-poppins font-medium"
                                >
                                    {forgotPasswordMutation.isPending
                                        ? t('auth.forgotPassword.submitting')
                                        : t('auth.forgotPassword.submitButton')}
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="px-6 py-8 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-mulish font-extrabold text-[#69C3CF] text-2xl mb-2">
                                    {t('auth.forgotPassword.successTitle')}
                                </h3>
                                <p className="font-mulish text-sm text-gray-600 mb-1">
                                    {t('auth.forgotPassword.successMessage')}
                                </p>
                                <p className="font-poppins font-semibold text-[#69C3CF] text-base mb-3">
                                    {emailValue}
                                </p>
                                <p className="font-mulish text-xs text-gray-500">
                                    {t('auth.forgotPassword.successNote')}
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Button
                                    onClick={handleResend}
                                    variant="outline"
                                    className="w-full h-11 border-[#69C3CF] text-[#69C3CF] hover:bg-[#E7F2F5] font-poppins font-medium"
                                >
                                    {t('auth.forgotPassword.resendButton')}
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    className="w-full h-11 bg-[#69C3CF] hover:bg-[#5AB3BF] text-white font-poppins font-medium"
                                >
                                    {t('auth.forgotPassword.backToLogin')}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
