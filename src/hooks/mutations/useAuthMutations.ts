import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../useRedux';
import { setAuthData, updateUser, logout as logoutAction } from '@/stores/auth';
import {
    loginAuth,
    registerAuth,
    forgotPasswordAuth,
    resetPasswordAuth,
    changePasswordAuth
} from '@/services/auth';
import { getProfile, updateProfile } from '@/services/profile';
import { uploadImageToCloudinary } from '@/services/upload-image';
import {
    TLoginAuth,
    TSignUpAuth,
    TForgotPasswordAuth,
    TResetPasswordAuth,
    TChangePassword,
    TUpdateProfile,
    TUserProfile
} from '@/types/auth';
import { ApiResponse } from '@/types/response';
import { useEffect } from 'react';

// =====================================================
// AUTH MUTATIONS (Login, Register, Password Management)
// =====================================================

/**
 * Login Mutation Hook
 * - React Query: Handles the API call, loading, and error states
 * - Redux: Updates the authenticated user state after successful login
 * - Fetches user profile to get accountId
 */
export function useLoginMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, TLoginAuth>({
        mutationFn: async (credentials: TLoginAuth) => {
            console.log('🔵 [useLoginMutation] Starting login request');
            const response = await loginAuth(credentials);
            console.log('📝 [useLoginMutation] Login response:', response.success ? 'Success' : 'Failed');
            if (!response.success) {
                throw new Error(response.message || 'Login failed');
            }
            return response;
        },
        onSuccess: async (data) => {
            if (data.data.data) {
                const responseData = data.data.data;
                const token = responseData.accessToken || responseData.token;
                const refreshToken = responseData.refreshToken;
                const { email, fullName, avatarUrl, roles, accountId } = responseData;

                // Update Redux with user data and tokens
                dispatch(setAuthData({
                    user: { email, fullName, avatarUrl, roles, accountId },
                    token,
                    refreshToken,
                }));

                // Fetch user profile to get accountId
                try {
                    const profileResponse = await getProfile(roles[0] || 'USER');
                    if (profileResponse.success && profileResponse.data) {
                        const userWithAccountId = {
                            ...profileResponse.data,
                            email,
                            fullName,
                            avatarUrl,
                            roles,
                        };

                        // Update Redux with complete user data including accountId
                        dispatch(updateUser(userWithAccountId));

                        // Update localStorage
                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem('userData', JSON.stringify(userWithAccountId));
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch user profile after login:', error);
                }

                // Invalidate and refetch user-related queries
                queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            }
        },
    });
}

/**
 * Register Mutation Hook
 * - Registers a new user
 * - Optionally logs them in automatically if token is returned
 * - Fetches user profile to get accountId
 */
export function useRegisterMutation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, TSignUpAuth>({
        mutationFn: async (userData: TSignUpAuth) => {
            const response = await registerAuth(userData);
            if (!response.success) {
                throw new Error(response.message || 'Registration failed');
            }
            return response;
        },
        onSuccess: async (data) => {
            // Auto-login after registration if token is provided
            if (data.data?.token) {
                const { token, email, fullName, avatarUrl, roles } = data.data;
                console.log(token, email, fullName, avatarUrl, roles);

                dispatch(setAuthData({
                    user: { email, fullName, avatarUrl, roles },
                    token,
                }));

                // Fetch user profile to get accountId
                try {
                    const profileResponse = await getProfile(roles[0] || 'USER');
                    if (profileResponse.success && profileResponse.data) {
                        const userWithAccountId = {
                            ...profileResponse.data,
                            email,
                            fullName,
                            avatarUrl,
                            roles,
                        };

                        // Update Redux with complete user data including accountId
                        dispatch(updateUser(userWithAccountId));

                        // Update localStorage
                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem('userData', JSON.stringify(userWithAccountId));
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch user profile after registration:', error);
                }

                queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            }
        },
    });
}

/**
 * Forgot Password Mutation Hook
 * - Sends password reset email
 */
export function useForgotPasswordMutation() {
    return useMutation<ApiResponse, Error, TForgotPasswordAuth>({
        mutationFn: async (data: TForgotPasswordAuth) => {
            const response = await forgotPasswordAuth(data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to send reset email');
            }
            return response;
        },
    });
}

/**
 * Reset Password Mutation Hook
 * - Resets password with token from email
 */
export function useResetPasswordMutation() {
    return useMutation<ApiResponse, Error, TResetPasswordAuth>({
        mutationFn: async (data: TResetPasswordAuth) => {
            const response = await resetPasswordAuth(data);
            if (!response.success) {
                throw new Error(response.message || 'Password reset failed');
            }
            return response;
        },
    });
}

/**
 * Change Password Mutation Hook
 * - Changes password for authenticated users
 */
export function useChangePasswordMutation() {
    return useMutation<ApiResponse, Error, TChangePassword>({
        mutationFn: async (data: TChangePassword) => {
            const response = await changePasswordAuth(data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to change password');
            }
            return response;
        },
    });
}

// =====================================================
// PROFILE QUERIES & MUTATIONS
// =====================================================

/**
 * User Profile Query Hook
 * - React Query: Fetches and caches user profile data
 * - Automatically refetches when user logs in
 */
export function useUserProfile(role: string, enabled: boolean = true) {
    const dispatch = useAppDispatch();

    const query = useQuery<TUserProfile | undefined, Error>({
        queryKey: ['user-profile', role],
        queryFn: async () => {
            const response = await getProfile(role);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch profile');
            };
            return response.data;
        },
        enabled, // Only fetch if user is authenticated
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update Redux when profile data is fetched
    useEffect(() => {
        if (query.data) {
            // Convert null to undefined for avatarUrl to match Redux state type
            const profileData = {
                ...query.data,
                avatarUrl: query.data.avatarUrl ?? undefined,
            };
            dispatch(updateUser(profileData));
        }
    }, [query.data, dispatch]);

    return query;
}

/**
 * Update Profile Mutation Hook
 * - Updates user profile
 * - Automatically updates Redux state and refetches profile
 */
export function useUpdateProfileMutation(role: string) {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation<ApiResponse, Error, TUpdateProfile>({
        mutationFn: async (data: TUpdateProfile) => {
            const response = await updateProfile(role, data);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update profile');
            }
            return response;
        },
        onSuccess: (data) => {
            if (data.data) {
                // Update Redux state
                dispatch(updateUser(data.data));

                // Invalidate profile query to refetch
                queryClient.invalidateQueries({ queryKey: ['user-profile', role] });
            }
        },
    });
}

/**
 * Upload Avatar Mutation Hook
 * - Uploads avatar image to Cloudinary
 * - Returns the image URL
 */
export function useUploadAvatarMutation() {
    return useMutation<ApiResponse, Error, File>({
        mutationFn: async (file: File) => {
            const response = await uploadImageToCloudinary(file);
            if (!response.success) {
                throw new Error(response.message || 'Failed to upload image');
            }
            return response;
        },
    });
}

// =====================================================
// LOGOUT
// =====================================================

/**
 * Logout Hook
 * - Clears Redux state
 * - Clears all React Query cache
 * - Redirects to login page
 */
export function useLogout() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return () => {
        // Clear Redux state
        dispatch(logoutAction());

        // Clear all React Query cache
        queryClient.clear();

        // Redirect to login
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };
}
