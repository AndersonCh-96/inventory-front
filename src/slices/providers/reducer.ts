import { createSlice } from '@reduxjs/toolkit';
import {
  createProvider,
  deleteProviderData,
  getProviders,
  updateProvider,
} from './thunk';

export const initialState: any = {
  providerList: [],
  errro: {},
  loading: false,
};

const ProviderSlice = createSlice({
  name: 'ProviderSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetProvider
    builder.addCase(getProviders.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getProviders.fulfilled, (state: any, action: any) => {
      state.providerList = action.payload;
      state.loading = false;
    });

    builder.addCase(getProviders.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create Provider
    builder.addCase(createProvider.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createProvider.fulfilled, (state: any, action: any) => {
      state.providerList = [...state.providerList, action.meta.arg];
      state.loading = false;
    });

    builder.addCase(createProvider.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Update Provicer
    builder.addCase(updateProvider.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(updateProvider.fulfilled, (state: any, action: any) => {
      state.providerList = state.providerList.map((item: any) =>
        item.id === action.meta.arg.id
          ? { ...state.providerList, ...action.meta.arg }
          : item,
      );
      state.loading = false;
    });

    builder.addCase(updateProvider.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Delete Provider
    builder.addCase(deleteProviderData.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(deleteProviderData.fulfilled, (state: any, action: any) => {
      state.providerList = state.providerList.filter(
        (item: any) => item.id !== action.meta.arg,
      );
      state.loading = false;
    });

    builder.addCase(deleteProviderData.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default ProviderSlice.reducer;
