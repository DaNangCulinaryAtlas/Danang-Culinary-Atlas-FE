import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MapRestaurant, Restaurant } from '@/types/restaurant';

interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
}

interface AtlasState {
    viewState: ViewState;
    searchQuery: string;
    searchResults: Restaurant[];
    selectedRestaurant: MapRestaurant | null;
}

const initialState: AtlasState = {
    viewState: {
        latitude: 16.0544,
        longitude: 108.2022,
        zoom: 15,
    },
    searchQuery: '',
    searchResults: [],
    selectedRestaurant: null,
};

const atlasSlice = createSlice({
    name: 'atlas',
    initialState,
    reducers: {
        setViewState: (state, action: PayloadAction<ViewState>) => {
            state.viewState = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setSearchResults: (state, action: PayloadAction<Restaurant[]>) => {
            state.searchResults = action.payload;
        },
        setSelectedRestaurant: (state, action: PayloadAction<MapRestaurant | null>) => {
            state.selectedRestaurant = action.payload;
        },
        clearSearch: (state) => {
            state.searchQuery = '';
            state.searchResults = [];
        },
    },
});

export const {
    setViewState,
    setSearchQuery,
    setSearchResults,
    setSelectedRestaurant,
    clearSearch,
} = atlasSlice.actions;

export default atlasSlice.reducer;
