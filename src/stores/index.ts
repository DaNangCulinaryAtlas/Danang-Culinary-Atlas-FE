import { configureStore } from '@reduxjs/toolkit'

import restaurantReducer from './restaurant'
export const store = configureStore({
    reducer: {
        restaurant: restaurantReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch