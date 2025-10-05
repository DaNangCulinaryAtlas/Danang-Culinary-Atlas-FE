'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import GoogleIcon from '@/../public/icons/GoogleIcon';
import FacebookIcon from '@/../public/icons/Facebook';
import AppleIcon from '@/../public/icons/Apple';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login:', { email, password });
        // Add your login logic here
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        // Add social login logic here
    };

    return (
        <div className="flex justify-center items-center md:w-[75%] min-h-screen mx-auto">
            <div className="flex flex-col lg:flex-row w-full h-[80vh] border shadow-lg ">
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
                    
                    {/* Centered Text Content */}
                    <div className="relative z-10 flex flex-col items-center justify-start w-full p-8 md:p-12 text-white text-center">
                        <div className='hidden lg:block'>
                            <h1 className="font-nicomoji text-[20px] md:text-[20px] lg:text-[20px] mb-4 md:mb-6 leading-tight whitespace-nowrap">
                                Danang Culinary Atlas
                            </h1>
                        </div>
                        <p className="text-base md:text-[12px] font-mulish leading-relaxed max-w-sm md:max-w-md px-4">
                            Let your journey be more than just sightseeing make it a colorful and flavorful culinary adventure.
                        </p>
                    </div>
                </div>
                <div className="w-full h-full lg:w-1/2 flex items-center justify-center sm:p-8 lg:p-10 bg-white">
                    <div className="w-full h-[90%] max-w-md">
                       <div className='flex flex-col justify-center items-center mb-2 '>
                            <h2 className='font-mulish font-extrabold text-[#69C3CF] md:text-5xl sm:text-4xl'> Welcome</h2>
                            <p className='font-mulish font-normal text-[#000000] md:text-[15px] sm:text-[10px]'>Login with Email</p>
                       </div>
                       <div className='space-y-4'>
                         <div className=''>
                            <label className="block text-sm text-[#69C3CF] font-poppins font-bold">
                                Email
                            </label>
                            <div className='relative'>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#000000]" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="pl-10 h-12 border-[#69C3CF]  text-[#000000] font-poppins font-medium text-[14px]"
                                />
                            </div>
                         </div>
                       </div>
                       <div className='mt-4 space-y-4'>
                         <div className=''>
                            <label className="block text-sm text-[#69C3CF] font-poppins font-bold">
                                Password
                            </label>
                            <div className='relative'>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#000000]" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="******"
                                    className="pl-10 h-12 border-[#69C3CF]  text-[#000000] font-poppins font-medium"
                                />
                            </div>
                         </div>
                        </div>
                        <div className='text-right pt-1'>
                            <Link 
                                href="/forgot-password" 
                                className='text-[10px] font-poppins text-[#69C3CF] '
                            >
                                Forgot your Password?
                            </Link>
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button
                                    onClick={handleLogin}
                                    className="w-25 bg-[#69C3CF] hover:bg-[#5AB3BF] rounded-[5] text-white h-10 font-poppins font-medium text-sm"
                            >
                                    LOGIN
                            </Button>
                        </div>
                        {/*Divider*/}
                        <div className="flex flex-col relative mt-2">
                            <div className='justify-center absolute inset-0 flex items-center'>
                                <div className="w-[70%] border-t border-gray-300"></div>
                            </div>
                            <div className='relative flex justify-center'>
                                <span className='px-2 bg-white text-gray-400'>OR</span>
                            </div>
                        </div>
                        {/* Social Login Buttons */}
                        <div className="flex justify-center space-x-4 mt-4">
                                {/* Google */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-[48px] w-[85px] bg-[#E7F2F5]"
                                    onClick={() => handleSocialLogin('Google')}
                                >
                                    <GoogleIcon />
                                </Button>

                                {/* Facebook */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-[48px] w-[85px] bg-[#E7F2F5]"
                                    onClick={() => handleSocialLogin('Facebook')}
                                >
                                    <FacebookIcon/>
                                </Button>

                                {/* Apple */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-[48px] w-[85px] bg-[#E7F2F5]"
                                    onClick={() => handleSocialLogin('Apple')}
                                >
                                    <AppleIcon/>
                                </Button>
                        
                            </div>
                            {/* Register Link */}
                            <div className="mt-6 text-center">
                                    <p className="text-[10px] font-mulish">
                                        Don't have account?{' '}
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