import { createSlice } from '@reduxjs/toolkit';
import { createSale, getDetailSale, getSales, getTotalSales } from './thunk';

export const initialState = {
  salesList: [],
  error: {},
  detailSale: {},
  loading: false,
  totalSales: {},
};

const SaleSlice = createSlice({
  name: 'SaleSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Get Sales
    builder.addCase(getSales.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getSales.fulfilled, (state: any, action: any) => {
      state.salesList = action.payload;
      state.loading = false;
    });

    builder.addCase(getSales.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //GETTOTALSALES

  builder.addCase(getTotalSales.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getTotalSales.fulfilled, (state: any, action: any) => {

      console.log("ACC", action)
      state.totalSales = action.payload.totalVentas;
      state.loading = false;
    });

    builder.addCase(getTotalSales.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //GetDEtails
    builder.addCase(getDetailSale.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getDetailSale.fulfilled, (state: any, action: any) => {
      state.detailSale = action.payload;
      state.loading = false;
    });

    builder.addCase(getDetailSale.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create Sales
    builder.addCase(createSale.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createSale.fulfilled, (state: any, action: any) => {
      state.salesList = [...state.salesList, action.payload.data];
      state.loading = false;
    });

    builder.addCase(createSale.rejected, (state: any, action: any) => {
      state.error = action.payload.data || null;
      state.loading = false;
    });
  },
});

export default SaleSlice.reducer;
