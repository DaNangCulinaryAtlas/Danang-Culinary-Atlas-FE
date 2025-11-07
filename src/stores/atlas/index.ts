import { Restaurant } from '@/types/restaurant/index';
import { getRestaurantsForMapAsync } from './action';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapBounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
}

interface AtlasState {
    restaurants: Restaurant[];
    loading: boolean;
    error: string | null;
    mapBounds: MapBounds | null;
    viewState: ViewState;
    lastFetchTime: number | null;
}

// Default view state centered on Hải Châu District, Đà Nẵng
const initialState: AtlasState = {
    restaurants: [],
    loading: false,
    error: null,
    mapBounds: null,
    viewState: {
        longitude: 108.2022, // Hải Châu, Đà Nẵng
        latitude: 16.0544,
        zoom: 13
    },
    lastFetchTime: null,
};

const atlasSlice = createSlice({
    name: 'atlas',
    initialState,
    reducers: {
        setMapBounds: (state, action: PayloadAction<MapBounds>) => {
            state.mapBounds = action.payload;
        },
        setViewState: (state, action: PayloadAction<ViewState>) => {
            state.viewState = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetAtlas: (state) => {
            state.restaurants = [];
            state.mapBounds = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRestaurantsForMapAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRestaurantsForMapAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload?.data || [];
                state.lastFetchTime = Date.now();
            })
            .addCase(getRestaurantsForMapAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch restaurants for map';
            });
    }
});

export const { setMapBounds, setViewState, clearError, resetAtlas } = atlasSlice.actions;
export default atlasSlice.reducer;
