import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPermission } from '../types/permission';

export interface AdminState {
  userPermissions: UserPermission[];
  isLoading: boolean;
  isFailed: boolean;
  writing: boolean;
  writingFailed: boolean;
}

const initialState: AdminState = {
  userPermissions: [],
  isLoading: false,
  isFailed: false,
  writing: false,
  writingFailed: false,
};

export const listAllUserPermissions = createAsyncThunk('permission/listAllUserPermissions', async () => {
  const response = await fetch('/api/manage/listAllUserPermissions', { method: 'GET' });
  if (!response.ok) {
    throw new Error('Failed to fetch all permission');
  }
  const data = await response.json();
  return data;
});

export const putUserPermission = createAsyncThunk('permission/putUserPermission', async (userPerm: UserPermission) => {
  const response = await fetch('/api/manage/putUserPermission', {
    method: 'PUT',
    body: JSON.stringify(userPerm),
  });
  if (!response.ok) {
    throw new Error('Failed to put user permission');
  }
  const data = await response.json();
  return data;
});

export const deleteUser = createAsyncThunk('permission/deleteUser', async (userName: string) => {
  const response = await fetch('/api/manage/deleteUser', {
    method: 'DELETE',
    body: JSON.stringify({ id: userName }),
  });
  if (!response.ok) {
    throw new Error('Failed to Delete user');
  }
  return userName;
});

// TODO: this whole thing is so similar to the other slice,
// there should be a way to create one abstract one
const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listAllUserPermissions.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(listAllUserPermissions.fulfilled, (state, action: PayloadAction<UserPermission[]>) => {
        state.isLoading = false;
        state.userPermissions = action.payload;
      })
      .addCase(listAllUserPermissions.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      })
      .addCase(putUserPermission.pending, (state) => {
        state.writing = true;
        state.writingFailed = false;
      })
      .addCase(putUserPermission.fulfilled, (state, action: PayloadAction<UserPermission>) => {
        state.writing = false;
        const writtenPermission = action.payload;
        const id = writtenPermission.id.toString();
        const indexOfUpdate = state.userPermissions.findIndex((permission) => id === permission.id);
        if (indexOfUpdate === -1) {
          state.userPermissions.push(writtenPermission);
        } else {
          state.userPermissions[indexOfUpdate] = writtenPermission;
        }
      })
      .addCase(putUserPermission.rejected, (state) => {
        state.writing = false;
        state.writingFailed = true;
      })
      .addCase(deleteUser.pending, (state) => {
        state.writing = true;
        state.writingFailed = false;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.writing = false;
        const id = action.payload;
        const indexOfUpdate = state.userPermissions.findIndex((user) => id === user.id);
        if (indexOfUpdate !== -1) {
          state.userPermissions.splice(indexOfUpdate, 1);
        }
      })
      .addCase(deleteUser.rejected, (state) => {
        state.writing = false;
        state.writingFailed = true;
      });
  },
});

export default permissionSlice.reducer;
