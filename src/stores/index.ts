import { configureStore } from '@reduxjs/toolkit'

import authReducer, { hydrateAuth } from './auth'
import atlasReducer from './atlas'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        atlas: atlasReducer,
    },
})

// Hydrate auth state from localStorage on store initialization
if (typeof window !== 'undefined') {
    store.dispatch(hydrateAuth())
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch