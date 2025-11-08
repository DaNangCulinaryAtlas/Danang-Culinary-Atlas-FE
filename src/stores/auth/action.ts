import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginAuth, registerAuth } from '@/services/auth';
import { TLoginAuth, TSignUpAuth } from '@/types/auth';
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
