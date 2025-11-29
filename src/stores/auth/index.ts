import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    language: 'vi' | 'en';
}

interface AuthState {
    user: UserDataType | null;
    token: string | null;
    isAuthenticated: boolean;
    ui: UIState;
}

// Initialize with a consistent state for both server and client
const getInitialState = (): AuthState => {
    return {
        user: null,
        token: null,
        isAuthenticated: false,
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
        setAuthData: (state, action: PayloadAction<{ user: UserDataType; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('token', action.payload.token);
                window.localStorage.setItem('userData', JSON.stringify(action.payload.user));
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

        // Logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            if (typeof window !== 'undefined') {
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('userData');
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
                const userData = window.localStorage.getItem('userData');

                if (token && userData) {
                    try {
                        state.user = JSON.parse(userData);
                        state.token = token;
                        state.isAuthenticated = true;
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
    logout,
    toggleSidebar,
    setTheme,
    setLanguage,
    hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;