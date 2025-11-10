import { getRestaurants, searchRestaurants, searchRestaurantsByName } from '@/services/restaurant';
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

export const searchRestaurantsByNameAsync = createAsyncThunk(
  'restaurant/searchRestaurantsByName',
  async (params: GetRestaurantsParams & { name: string }) => {
    const response = await searchRestaurantsByName(params);
    return response;
  }
);