import { createSlice } from '@reduxjs/toolkit';
import { createUser, deleteUserData, editUserData, getUser } from './thunk';

export const initialState: any = {
  userList: [],
  error: {},
  loading: false,
};
const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetUser
    builder.addCase(getUser.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getUser.fulfilled, (state: any, action: any) => {
      state.userList = action.payload;
      state.loading = false;
    });

    builder.addCase(getUser.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create User
    builder.addCase(createUser.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createUser.fulfilled, (state: any, action: any) => {
      state.userList = [...state.userList, action.meta.arg];
      state.loading = false;
    });

    builder.addCase(createUser.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
    //UpdateUser

    builder.addCase(editUserData.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(editUserData.fulfilled, (state: any, action: any) => {
      state.userList = state.userList.map((item: any) =>
        item.id === action.meta.arg.id
          ? { ...state.userList, ...action.meta.arg }
          : item,
      );
      state.loading = false;
    });

    builder.addCase(editUserData.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Delete User
    builder.addCase(deleteUserData.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(deleteUserData.fulfilled, (state: any, action: any) => {
      state.userList = state.userList.filter(
        (item: any) => item.id !== action.meta.arg,
      );
      state.loading = false;
    });

    builder.addCase(deleteUserData.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default UserSlice.reducer;
