import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Roles } from '../types/user';

interface UserState {
  roles: Roles[];
  loggedIn: boolean;
  id?: string;
  userName?: string;
}

const initialState: UserState = {
  roles: [Roles.anonymous],
  loggedIn: false,
};

interface clientPrincipalResponse {
  userRoles: Roles[];
  userDetails: string;
  userId: string;
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await fetch('/.auth/me');
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return (await response.json()).clientPrincipal as clientPrincipalResponse;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, () => {
        clearUser();
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<clientPrincipalResponse>) => {
        if (action.payload == null) {
          clearUser();
        } else {
          const roles = action.payload.userRoles;
          state.id = action.payload.userId;
          state.userName = action.payload.userDetails;
          state.roles = roles;
          state.loggedIn = true;
        }
      })
      .addCase(fetchUser.rejected, () => {
        clearUser();
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
