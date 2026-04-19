import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import permission from './permissionSlice';
import user from './userSlice';
import locDunDisplayContent from './locDunDisplayContentSlice';
import locDunView from './locDunViewSlice';
import { fetchAllLocDunsIfNotprovided } from './fetchAllLocDunsMiddleware';

export const rootReducer = combineReducers({
  permission,
  user,
  locDunDisplayContent,
  locDunView,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fetchAllLocDunsIfNotprovided),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
