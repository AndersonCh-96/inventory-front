import { createSlice } from '@reduxjs/toolkit';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from './thunk';

export const initialState: any = {
  customerList: [],
  error: {},
  loading: false,
};

const CustomerSlice = createSlice({
  name: 'CustomerSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Get

    builder.addCase(getCustomers.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getCustomers.fulfilled, (state: any, action: any) => {
      state.customerList = action.payload;
      state.loading = false;
    });

    builder.addCase(getCustomers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create
    builder.addCase(createCustomer.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createCustomer.fulfilled, (state: any, action: any) => {
      state.customerList = [...state.customerList, action.meta.arg];
      state.loading = false;
    });

    builder.addCase(createCustomer.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Update
    builder.addCase(updateCustomer.pending, (state: any, action: any) => {
      state.loading = true;
    });
    builder.addCase(updateCustomer.fulfilled, (state: any, action: any) => {
      state.customerList = state.customerList.map((item: any) =>
        item.id === action.meta.arg.id
          ? { ...state.customerList, ...action.meta.arg }
          : item,
      );
      state.loading = false;
    });

    builder.addCase(updateCustomer.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Delete
    builder.addCase(deleteCustomer.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(deleteCustomer.fulfilled, (state: any, action: any) => {
      state.customerList = state.customerList.filter(
        (item: any) => item.id !== action.meta.arg,
      );
      state.loading = false;
    });

    builder.addCase(deleteCustomer.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default CustomerSlice.reducer;
