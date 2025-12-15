import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    language: 'vi' | 'en';
}
interface UserDataType {
    accountId?: string;
    email: string;
    fullName: string | null;
    avatarUrl?: string;
    roles: string[];
    status?: string;
    dob?: string | null;
    gender?: string | null;
}

interface AuthState {
    user: UserDataType | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    accountId: string | null;
    ui: UIState;
}

// Initialize with a consistent state for both server and client
const getInitialState = (): AuthState => {
    return {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        accountId: null,
        ui: {
            sidebarOpen: false,
            theme: 'light',
            language: 'vi',
        },
    };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set user data after successful login/register (called by React Query)
        setAuthData: (state, action: PayloadAction<{ user: UserDataType; token: string; refreshToken?: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken || null;
            state.isAuthenticated = true;
            state.accountId = action.payload.user.accountId || null;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('token', action.payload.token);
                window.localStorage.setItem('userData', JSON.stringify(action.payload.user));
                if (action.payload.refreshToken) {
                    window.localStorage.setItem('refreshToken', action.payload.refreshToken);
                }
            }
        },

        // Update user profile (called after profile mutations)
        updateUser: (state, action: PayloadAction<Partial<UserDataType>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };

                // Update localStorage
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('userData', JSON.stringify(state.user));
                }
            }
        },

        // Update tokens (used after refresh token)
        updateTokens: (state, action: PayloadAction<{ token: string; refreshToken?: string }>) => {
            state.token = action.payload.token;
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
            }

            // Update localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('token', action.payload.token);
                if (action.payload.refreshToken) {
                    window.localStorage.setItem('refreshToken', action.payload.refreshToken);
                }
            }
        },

        // Logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.accountId = null;

            if (typeof window !== 'undefined') {
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('refreshToken');
                window.localStorage.removeItem('userData');
                window.localStorage.removeItem('accountId');
            }
        },

        // UI State Management
        toggleSidebar: (state) => {
            state.ui.sidebarOpen = !state.ui.sidebarOpen;
        },

        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.ui.theme = action.payload;
        },

        setLanguage: (state, action: PayloadAction<'vi' | 'en'>) => {
            state.ui.language = action.payload;
        },

        // Hydrate auth state (useful for SSR or page refresh)
        hydrateAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = window.localStorage.getItem('token');
                const refreshToken = window.localStorage.getItem('refreshToken');
                const userData = window.localStorage.getItem('userData');
                const accountId = window.localStorage.getItem('accountId');

                if (token && userData) {
                    try {
                        state.user = JSON.parse(userData);
                        state.token = token;
                        state.refreshToken = refreshToken;
                        state.isAuthenticated = true;
                        state.accountId = accountId;
                    } catch (error) {
                        console.error('Failed to hydrate auth state:', error);
                    }
                }
            }
        },
    },
});

export const {
    setAuthData,
    updateUser,
    updateTokens,
    logout,
    toggleSidebar,
    setTheme,
    setLanguage,
    hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;