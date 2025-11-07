import { configureStore } from '@reduxjs/toolkit'

import restaurantReducer from './restaurant'
import atlasReducer from './atlas'

export const store = configureStore({
    reducer: {
        restaurant: restaurantReducer,
        atlas: atlasReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch