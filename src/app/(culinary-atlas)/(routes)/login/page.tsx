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
import { useLoginMutation } from '@/hooks/mutations/useAuthMutations';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { useState } from 'react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 md:p-0">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl shadow-xl border rounded-lg overflow-hidden">

        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="absolute inset-0">
            <Image
              src="/images/login-image.png"
              alt="Login Image"
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
              Hãy để hành trình của bạn không chỉ là ngắm cảnh — mà còn là một chuyến phiêu lưu ẩm thực rực rỡ và đậm đà hương vị.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-white">
          <div className="w-full max-w-md space-y-6">

            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="font-mulish font-extrabold text-[#69C3CF] text-4xl sm:text-5xl">
                Welcome
              </h2>
              <p className="font-mulish text-sm text-[#000000] mt-1">
                Login with Email
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Error Area - Fixed Height */}
              <div className="h-[3.25rem] flex items-start">
                {loginMutation.error ? (
                  <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm animate-fadeIn">
                    {loginMutation.error.message}
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
                    disabled={loginMutation.isPending}
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
                    disabled={loginMutation.isPending}
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

              {/* Remember Me & Forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#69C3CF] rounded focus:ring-[#69C3CF]"
                  />
                  <span className="text-gray-600 font-poppins">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-[#69C3CF] hover:underline font-poppins">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11 bg-[#69C3CF] hover:bg-[#5AB3BF] text-white font-poppins text-sm font-medium rounded-md disabled:opacity-50"
              >
                {loginMutation.isPending ? 'ĐANG ĐĂNG NHẬP' : 'ĐĂNG NHẬP'}
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

            {/* Social Login */}
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-20 bg-[#E7F2F5] border-[#E7F2F5] hover:bg-[#d8e8ec]"
                onClick={() => handleSocialLogin('Google')}
              >
                <GoogleIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-20 bg-[#E7F2F5] border-[#E7F2F5] hover:bg-[#d8e8ec]"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FacebookIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-20 bg-[#E7F2F5] border-[#E7F2F5] hover:bg-[#d8e8ec]"
                onClick={() => handleSocialLogin('Apple')}
              >
                <AppleIcon />
              </Button>
            </div>

            {/* Register Link */}
            <p className="text-center text-xs font-mulish text-gray-600">
              Bạn chưa có tài khoản?{' '}
              <Link href="/register" className="text-[#69C3CF] hover:text-[#5AB3BF] font-semibold">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}