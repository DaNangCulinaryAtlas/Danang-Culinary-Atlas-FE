import { getRestaurantsForMap } from '@/services/restaurant';
import { getRestaurantsForMapParams } from '@/types/restaurant/index';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getRestaurantsForMapAsync = createAsyncThunk(
    'atlas/fetchRestaurantsForMap',
    async (params: getRestaurantsForMapParams) => {
        const response = await getRestaurantsForMap(params);
        return response;
    }
);
