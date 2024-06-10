import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'

const persistConfig = {
  key: 'user',
  storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

const store = configureStore({ 
  reducer: {
    user: persistedReducer,
  }
})

const persistor = persistStore(store)

export default store

export { persistor }
