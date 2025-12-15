import { configureStore } from '@reduxjs/toolkit'

import authReducer from './auth'
import atlasReducer from './atlas'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        atlas: atlasReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch