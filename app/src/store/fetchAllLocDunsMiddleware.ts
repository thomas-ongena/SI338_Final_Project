import { Middleware } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { getLocDunById, listLocDuns } from './locDunViewSlice';
import { Action } from 'redux';

export const fetchAllLocDunsIfNotprovided: Middleware = (store) => (next) => async (action) => {
  const result = next(action);

  if (getLocDunById.fulfilled.match(action)) {
    const state = store.getState();

    if (!state.locDunView.availableLocDuns) {
      const dispatch = store.dispatch as ThunkDispatch<typeof state, unknown, Action>;
      await dispatch(listLocDuns());
    }
  }

  return result;
};
