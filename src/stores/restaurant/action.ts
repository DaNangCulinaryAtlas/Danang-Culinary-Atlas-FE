import { getRestaurants, searchRestaurants } from '@/services/restaurant';
import { GetRestaurantsParams } from '@/types/restaurant/index';
import { createAsyncThunk } from '@reduxjs/toolkit';



export const getRestaurantsAsync = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (params: GetRestaurantsParams) => {
    const response = await getRestaurants(params);
    return response;
  }
);

export const searchRestaurantsAsync = createAsyncThunk(
  'restaurant/searchRestaurants',
  async (params: GetRestaurantsParams) => {
    const response = await searchRestaurants(params);
    return response;
  }
);