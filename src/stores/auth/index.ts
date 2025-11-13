import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'

import { loginAuth } from '@/services/auth'

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, fetchUserProfile, updateUserProfile, uploadAvatar } from './action';

interface UserDataType {
    accountId?: string;
    email: string;
    fullName: string | null;
    avatarUrl?: string | null;
    roles: string[];
    status?: string;
    dob?: string | null;
    gender?: string | null;
}

interface AuthState {
    user: UserDataType | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// Initialize with a consistent state for both server and client
const getInitialState = (): AuthState => {
    return {
        user: null,
        token: null,
        loading: false,
        error: null,
    };
};

const initialState: AuthState = getInitialState();

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
        hydrateAuth: (state) => {
            // Manual hydration action if needed
            if (typeof window !== 'undefined') {
                const token = window.localStorage.getItem('token');
                const userData = window.localStorage.getItem('userData');

                if (token && userData) {
                    try {
                        state.user = JSON.parse(userData);
                        state.token = token;
                    } catch (error) {
                        console.error('Failed to hydrate auth state:', error);
                    }
                }
            }
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

        // Fetch Profile
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            const { accountId, email, fullName, avatarUrl, status, dob, gender } = action.payload;

            // Merge the profile data with existing user data (keep roles from login)
            state.user = {
                ...state.user,
                accountId,
                email,
                fullName,
                avatarUrl: avatarUrl ?? undefined,
                status,
                dob,
                gender,
                roles: state.user?.roles || []
            };

            // Update localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('userData', JSON.stringify(state.user));
            }
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Profile
        builder.addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            const { accountId, email, fullName, avatarUrl, status, dob, gender } = action.payload;

            // Update user data with new profile information
            state.user = {
                ...state.user,
                accountId,
                email,
                fullName,
                avatarUrl: avatarUrl ?? undefined,
                status,
                dob,
                gender,
                roles: state.user?.roles || []
            };

            // Update localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('userData', JSON.stringify(state.user));
            }
        });
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Upload Avatar
        builder.addCase(uploadAvatar.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(uploadAvatar.fulfilled, (state, action) => {
            state.loading = false;
            // Don't update user state here, just return the URL
            // The component will handle updating the form data
        });
        builder.addCase(uploadAvatar.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setUser, setToken, logout, clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;