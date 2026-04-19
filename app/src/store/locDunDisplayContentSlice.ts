import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocDunContentEntry, LocDunMapping } from '../types/locDun';

export interface LocDunDisplayContentState {
  locDunContent: LocDunMapping[];
  isLoading: boolean;
  isFailed: boolean;
  writing: boolean;
  writingFailed: boolean;
}

const initialState: LocDunDisplayContentState = {
  locDunContent: [],
  isLoading: false,
  isFailed: false,
  writing: false,
  writingFailed: false,
};

export const listLocDunContent = createAsyncThunk('locDunContent/listLocDunContent', async () => {
  const response = await fetch('/api/manage/listLocDunContent', { method: 'GET' });
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const data = await response.json();
  return data;
});

export const putLocDunById = createAsyncThunk('locDunContent/putLocDunById', async (locDunMapping: LocDunMapping) => {
  const response = await fetch('/api/manage/putLocDunById', {
    method: 'PUT',
    body: JSON.stringify(locDunMapping),
  });
  if (!response.ok) {
    throw new Error('Failed to Write data');
  }
  // Return the locDunMapping we put so that we can update state on fulfilled
  return locDunMapping;
});

export const deleteLocDunById = createAsyncThunk('locDunContent/deleteLocDunById', async (id: string) => {
  const response = await fetch('/api/manage/deleteLocDunById', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error('Failed to Delete data');
  }
  return id;
});

const locDunDisplayContentSlice = createSlice({
  name: 'locDunDisplayContent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listLocDunContent.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(listLocDunContent.fulfilled, (state, action: PayloadAction<LocDunMapping[]>) => {
        state.isLoading = false;
        state.locDunContent = action.payload.map((item) => {
          return { id: item.id, entries: item.entries as LocDunContentEntry[] } as LocDunMapping;
        });
      })
      .addCase(listLocDunContent.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      })
      .addCase(putLocDunById.pending, (state) => {
        state.writing = true;
        state.writingFailed = false;
      })
      .addCase(putLocDunById.fulfilled, (state, action: PayloadAction<LocDunMapping>) => {
        state.writing = false;
        const writtenLocDun = action.payload;
        const id = writtenLocDun.id;
        const indexOfUpdate = state.locDunContent.findIndex((locDun) => id === locDun.id);
        if (indexOfUpdate === -1) {
          state.locDunContent.push(writtenLocDun);
        } else {
          state.locDunContent[indexOfUpdate] = writtenLocDun;
        }
      })
      .addCase(putLocDunById.rejected, (state) => {
        state.writing = false;
        state.writingFailed = true;
      })
      .addCase(deleteLocDunById.pending, (state) => {
        state.writing = true;
        state.writingFailed = false;
      })
      .addCase(deleteLocDunById.fulfilled, (state, action: PayloadAction<string>) => {
        state.writing = false;
        const id = action.payload;
        const indexOfUpdate = state.locDunContent.findIndex((locDun) => id === locDun.id);
        if (indexOfUpdate !== -1) {
          state.locDunContent.splice(indexOfUpdate, 1);
        }
      })
      .addCase(deleteLocDunById.rejected, (state) => {
        state.writing = false;
        state.writingFailed = true;
      });
  },
});

export default locDunDisplayContentSlice.reducer;
