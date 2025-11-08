import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'

import { loginAuth } from '@/services/auth'

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './action';

interface UserDataType {
    email: string;
    fullName: string;
    avatarUrl?: string;
    roles: string[];
}

interface AuthState {
    user: UserDataType | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserDataType>) => {
            state.user = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('userData');
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            const { token, email, fullName, avatarUrl, roles } = action.payload.data;
            state.user = { email, fullName, avatarUrl, roles };
            state.token = token;
            state.error = null;

            if (typeof window !== 'undefined') {
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('userData', JSON.stringify({ email, fullName, avatarUrl, roles }));
            }
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(registerUser.pending, (state) => {
            // Where is state management for registration? 
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            // Optionally auto-login after registration
            if (action.payload.data?.token) {
                const { token, email, fullName, avatarUrl, roles } = action.payload.data;
                state.user = { email, fullName, avatarUrl, roles };
                state.token = token;

                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('token', token);
                    window.localStorage.setItem('userData', JSON.stringify({ email, fullName, avatarUrl, roles }));
                }
            }
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setUser, setToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;