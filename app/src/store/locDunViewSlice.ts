import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocDunMapping } from '../types/locDun';

export interface LocDunViewState {
  availableLocDuns?: string[];
  locDunContent?: LocDunMapping;
  isLoading: boolean;
  isFailed: boolean;
}

const initialState: LocDunViewState = {
  isLoading: false,
  isFailed: false,
};

export const getLocDunById = createAsyncThunk('locDunView/getLocDunById', async (id: string) => {
  const response = await fetch(`/api/getLocDunById?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const data = await response.json();
  return data;
});

export const listLocDuns = createAsyncThunk('locDunView/listLocDuns', async () => {
  const response = await fetch('/api/listLocDuns');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const data = await response.json();
  return data;
});

const locDunViewlice = createSlice({
  name: 'locDunView',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLocDunById.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(getLocDunById.fulfilled, (state, action: PayloadAction<LocDunMapping>) => {
        state.locDunContent = action.payload;
        state.isLoading = false;
      })
      .addCase(getLocDunById.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      })
      .addCase(listLocDuns.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(listLocDuns.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.availableLocDuns = action.payload;
        state.isLoading = false;
      })
      .addCase(listLocDuns.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      });
  },
});

export default locDunViewlice.reducer;
