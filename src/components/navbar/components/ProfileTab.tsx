'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, User, Shield } from 'lucide-react';
import Image from 'next/image';

interface ProfileTabProps {
    user: {
        email?: string;
        fullName?: string;
        avatarUrl?: string;
        roles: string[];
    } | null;
}

export default function ProfileTab({ user }: ProfileTabProps) {
    return (
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
    );
}
