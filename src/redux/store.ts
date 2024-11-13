import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './reducers/_root.reducer';

const isDevelopment = import.meta.env.MODE === 'development';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    isDevelopment
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: isDevelopment
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;