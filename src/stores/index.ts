import { configureStore } from '@reduxjs/toolkit'

import restaurantReducer from './restaurant'
import atlasReducer from './atlas'
import authReducer from './auth'

export const store = configureStore({
    reducer: {
        restaurant: restaurantReducer,
        atlas: atlasReducer,
        auth: authReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch