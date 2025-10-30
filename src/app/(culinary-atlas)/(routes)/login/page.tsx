'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import GoogleIcon from '@/../public/icons/GoogleIcon';
import FacebookIcon from '@/../public/icons/Facebook';
import AppleIcon from '@/../public/icons/Apple';
import { useAuth } from '@/hooks/useAuth';
import { BASE_URL } from '@/configs/api';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(BASE_URL);
      await login(
        { email, password },
        (err: any) => {
          setError(err?.message || 'Login failed. Please check your credentials.');
          setIsLoading(false);
        }
      );
    } catch (err: any) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    setError(`${provider} login not implemented yet`);
  };

  return (
    <div className="flex justify-center items-center md:w-[75%] min-h-screen mx-auto">
      <div className="flex flex-col lg:flex-row w-full h-[80vh] border shadow-lg">
        {/* Left Side - Image */}
        <div className="hidden lg:flex md:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-400">
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
          
          <div className="relative z-10 flex flex-col items-center justify-start w-full p-8 md:p-12 text-white text-center">
            <div className="hidden lg:block">
              <h1 className="font-nicomoji text-[20px] mb-4 md:mb-6 leading-tight whitespace-nowrap">
                Danang Culinary Atlas
              </h1>
            </div>
            <p className="text-base md:text-[12px] font-mulish leading-relaxed max-w-sm md:max-w-md px-4">
              Let your journey be more than just sightseeing make it a colorful and flavorful culinary adventure.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full h-full lg:w-1/2 flex items-center justify-center sm:p-8 lg:p-10 bg-white">
          <div className="w-full h-[90%] max-w-md">
            <div className="flex flex-col justify-center items-center mb-6">
              <h2 className="font-mulish font-extrabold text-[#69C3CF] md:text-5xl sm:text-4xl">
                Welcome
              </h2>
              <p className="font-mulish font-normal text-[#000000] md:text-[15px] sm:text-[10px]">
                Login with Email
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm text-[#69C3CF] font-poppins font-bold mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-[#69C3CF] text-[#000000] font-poppins font-medium text-[14px]"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm text-[#69C3CF] font-poppins font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="pl-10 pr-10 h-12 border-[#69C3CF] text-[#000000] font-poppins font-medium"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#69C3CF] border-gray-300 rounded focus:ring-[#69C3CF]"
                  />
                  <span className="text-xs font-poppins text-gray-600">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-[10px] font-poppins text-[#69C3CF] hover:underline"
                >
                  Forgot your Password?
                </Link>
              </div>

              {/* Login Button */}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-32 bg-[#69C3CF] hover:bg-[#5AB3BF] rounded-md text-white h-10 font-poppins font-medium text-sm disabled:opacity-50"
                >
                  {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex flex-col relative mt-4">
              <div className="justify-center absolute inset-0 flex items-center">
                <div className="w-[70%] border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-gray-400">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                type="button"
                variant="outline"
                className="h-[48px] w-[85px] bg-[#E7F2F5]"
                onClick={() => handleSocialLogin('Google')}
              >
                <GoogleIcon />
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-[48px] w-[85px] bg-[#E7F2F5]"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FacebookIcon />
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-[48px] w-[85px] bg-[#E7F2F5]"
                onClick={() => handleSocialLogin('Apple')}
              >
                <AppleIcon />
              </Button>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-[10px] font-mulish">
                Don&apos;t have account?{' '}
                <Link href="/register" className="text-[#69C3CF] hover:text-[#5AB3BF] font-semibold transition-colors">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}