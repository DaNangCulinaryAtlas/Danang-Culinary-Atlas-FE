
import { getRestaurants } from '@/services/restaurant';
import { GetRestaurantsParams } from '@/types/restaurant/index';
import { createAsyncThunk } from '@reduxjs/toolkit';



export const getRestaurantsAsync = createAsyncThunk(
    'restaurant/fetchRestaurants',
    async (params: GetRestaurantsParams) => {
      const response = await getRestaurants(params);
      return response;
    }
);