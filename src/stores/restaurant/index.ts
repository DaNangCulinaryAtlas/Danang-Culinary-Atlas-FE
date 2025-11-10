import { Restaurant, RestaurantResponse } from '@/types/restaurant/index';
import { getRestaurantsAsync, searchRestaurantsAsync, searchRestaurantsByNameAsync } from './action';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RestaurantState {
    restaurants: Restaurant[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    filters: {
        status?: string;
        wardId?: number;
        approvalStatus?: string;
    };
}
const initialState: RestaurantState = {
    restaurants: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    loading: false,
    error: null,
    searchQuery: '',
    filters: {},
}
const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setFilters: (state, action: PayloadAction<RestaurantState['filters']>) => {
            state.filters = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetFilters: (state) => {
            state.searchQuery = '';
            state.filters = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRestaurantsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRestaurantsAsync.fulfilled, (state, action) => {
                state.loading = false;
                // Using ? behind action.payload to handle potential undefined values
                state.restaurants = action.payload?.data?.content || [];
                state.totalPages = action.payload?.data?.totalPages;
                state.totalElements = action.payload.data?.totalElements;
                state.currentPage = action.payload.data?.number;
                state.pageSize = action.payload.data?.size;
            })
            .addCase(getRestaurantsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch restaurants';
            })
            // Add search restaurant cases
            .addCase(searchRestaurantsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRestaurantsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload?.data?.content || [];
                state.totalPages = action.payload?.data?.totalPages;
                state.totalElements = action.payload.data?.totalElements;
                state.currentPage = action.payload.data?.number;
                state.pageSize = action.payload.data?.size;
            })
            .addCase(searchRestaurantsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to search restaurants';
            })
            // Add search by name cases
            .addCase(searchRestaurantsByNameAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRestaurantsByNameAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload?.data?.content || [];
                state.totalPages = action.payload?.data?.totalPages;
                state.totalElements = action.payload.data?.totalElements;
                state.currentPage = action.payload.data?.number;
                state.pageSize = action.payload.data?.size;
            })
            .addCase(searchRestaurantsByNameAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to search restaurants by name';
            });
    }
});

export const { setCurrentPage, setSearchQuery, setFilters, clearError, resetFilters } = restaurantSlice.actions;
export default restaurantSlice.reducer;