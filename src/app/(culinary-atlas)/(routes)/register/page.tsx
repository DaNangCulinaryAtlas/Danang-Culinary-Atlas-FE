'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import GoogleIcon from '@/../public/icons/GoogleIcon';
import FacebookIcon from '@/../public/icons/Facebook';
import AppleIcon from '@/../public/icons/Apple';
import { useRegisterMutation } from '@/hooks/mutations/useAuthMutations';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const registerMutation = useRegisterMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            role: 'USER',
            agreeTerms: false,
        },
    });

    const selectedRole = watch('role');

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(
            {
                email: data.email,
                password: data.password,
                role: data.role,
            },
            {
                onSuccess: () => {
                    toast.success('Đăng ký tài khoản thành công! Đang chuyển hướng...', {
                        position: 'top-right',
                        autoClose: 2500,
                    });

                    setTimeout(() => router.push('/login'), 2500);
                },
                onError: (error) => {
                    toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.', {
                        position: 'top-right',
                    });
                },
            }
        );
    };

    const handleSocialRegister = (provider: string) => {
        console.log(`Register with ${provider}`);
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 md:p-0">
            <div className="flex flex-col lg:flex-row w-full max-w-6xl shadow-xl border rounded-lg overflow-hidden">

                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-400">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/login-image.png"
                            alt="Register Image"
                            fill
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
                            Join us and discover the most amazing culinary experiences in Da Nang.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-white">
                    <div className="w-full max-w-md space-y-6">

                        {/* Header */}
                        <div className="text-center mb-4">
                            <h2 className="font-mulish font-extrabold text-[#69C3CF] text-4xl sm:text-5xl">
                                Register
                            </h2>
                            <p className="font-mulish text-sm text-[#000000] mt-1">
                                Create your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Error Area - Fixed Height */}
                            <div className="h-[3.25rem] flex items-start">
                                {registerMutation.error ? (
                                    <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm animate-fadeIn">
                                        {registerMutation.error.message}
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
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        {...register('email')}
                                        placeholder="Enter your email"
                                        className="pl-10 h-12 border-[#69C3CF] font-poppins text-sm"
                                        disabled={registerMutation.isPending}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 font-poppins">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-[#69C3CF] mb-1 font-poppins">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        placeholder="******"
                                        className="pl-10 pr-10 h-12 border-[#69C3CF] font-poppins text-sm"
                                        disabled={registerMutation.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1 font-poppins">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-bold text-[#69C3CF] mb-1 font-poppins">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        placeholder="******"
                                        className="pl-10 pr-10 h-12 border-[#69C3CF] font-poppins text-sm"
                                        disabled={registerMutation.isPending}
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

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-bold text-[#69C3CF] mb-2 font-poppins">
                                    Register as
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer flex-1">
                                        <input
                                            type="radio"
                                            value="USER"
                                            {...register('role')}
                                            className="w-4 h-4 text-[#69C3CF] focus:ring-[#69C3CF]"
                                            disabled={registerMutation.isPending}
                                        />
                                        <span className="text-sm text-gray-700 font-poppins">Người dùng</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer flex-1">
                                        <input
                                            type="radio"
                                            value="VENDOR"
                                            {...register('role')}
                                            className="w-4 h-4 text-[#69C3CF] focus:ring-[#69C3CF]"
                                            disabled={registerMutation.isPending}
                                        />
                                        <span className="text-sm text-gray-700 font-poppins">Chủ nhà hàng</span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 font-poppins">
                                    {selectedRole === 'USER'
                                        ? 'Đăng ký tài khoản người dùng để khám phá ẩm thực Đà Nẵng.'
                                        : 'Đăng ký tài khoản chủ nhà hàng để quản lý nhà hàng của bạn.'}
                                </p>
                                {errors.role && (
                                    <p className="text-red-500 text-xs mt-1 font-poppins">{errors.role.message}</p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-center text-xs">
                                <label className="flex items-start space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('agreeTerms')}
                                        className="w-4 h-4 mt-0.5 text-[#69C3CF] rounded focus:ring-[#69C3CF]"
                                    />
                                    <span className="text-gray-600 font-poppins">
                                        Tôi đồng ý với{' '}
                                        <Link href="/terms" className="text-[#69C3CF] hover:underline">
                                            Điều khoản và Điều kiện
                                        </Link>
                                    </span>
                                </label>
                            </div>
                            {errors.agreeTerms && (
                                <p className="text-red-500 text-xs font-poppins">{errors.agreeTerms.message}</p>
                            )}

                            {/* Register Button */}
                            <Button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full h-11 bg-[#69C3CF] hover:bg-[#5AB3BF] text-white font-poppins text-sm font-medium rounded-md disabled:opacity-50"
                            >
                                {registerMutation.isPending ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-3 bg-white text-gray-400 text-sm">OR</span>
                            </div>
                        </div>

                        {/* Social Register */}
                        <div className="flex justify-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-20 bg-[#E7F2F5] border-[#E7F2F5] hover:bg-[#d8e8ec]"
                                onClick={() => handleSocialRegister('Google')}
                            >
                                <GoogleIcon />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-20 bg-[#E7F2F5] border-[#E7F2F5] hover:bg-[#d8e8ec]"
                                onClick={() => handleSocialRegister('Facebook')}
                            >
                                <FacebookIcon />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-20 bg-[#E7F2F5] border-[#E7F2F5] hover:bg-[#d8e8ec]"
                                onClick={() => handleSocialRegister('Apple')}
                            >
                                <AppleIcon />
                            </Button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-xs font-mulish text-gray-600">
                            Bạn đã có tài khoản?{' '}
                            <Link href="/login" className="text-[#69C3CF] hover:text-[#5AB3BF] font-semibold">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
