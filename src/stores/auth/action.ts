import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginAuth, registerAuth } from '@/services/auth';
import { getProfile, updateProfile } from '@/services/profile';
import { uploadImageToCloudinary } from '@/services/upload-image';
import { TLoginAuth, TSignUpAuth, TUpdateProfile } from '@/types/auth';
import { ApiResponse } from '@/types/response';

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: TLoginAuth, { rejectWithValue }) => {
        try {
            const response = await loginAuth(credentials);

            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Login failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during login');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: TSignUpAuth, { rejectWithValue }) => {
        try {
            const response = await registerAuth(userData);

            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Registration failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during registration');
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (role: string, { rejectWithValue }) => {
        try {
            const response = await getProfile(role);

            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch profile');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred while fetching profile');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ role, data }: { role: string; data: TUpdateProfile }, { rejectWithValue }) => {
        try {
            const response = await updateProfile(role, data);

            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to update profile');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred while updating profile');
        }
    }
);

export const uploadAvatar = createAsyncThunk(
    'auth/uploadAvatar',
    async (file: File, { rejectWithValue }) => {
        try {
            const response = await uploadImageToCloudinary(file);

            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to upload image');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred while uploading image');
        }
    }
);
