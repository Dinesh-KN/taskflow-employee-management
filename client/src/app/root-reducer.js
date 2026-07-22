import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/auth.slice';

import appReducer from './app.slice';

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
});
