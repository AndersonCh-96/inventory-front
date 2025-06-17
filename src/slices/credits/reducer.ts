import { createSlice } from '@reduxjs/toolkit';
import {
  getCredits,
  getCustomerCredits,
  createPyamentCredit,
  getTotalCredits,
} from './thunk';

const initialState = {
  creditsList: [],
  totalCredits: 0,
  creditCustomer: {},
  error: {},
  loading: false,
};

const CreditSlice = createSlice({
  name: 'CreditSlice',
  reducers: {},
  initialState,
  extraReducers: (builder) => {
    //Get Credits
    builder.addCase(getCredits.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getCredits.fulfilled, (state: any, action: any) => {
      state.creditsList = action.payload;
      state.loading = false;
    });

    builder.addCase(getCredits.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Get TOtal Credits
    builder.addCase(getTotalCredits.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getTotalCredits.fulfilled, (state: any, action: any) => {
      state.totalCredits = action.payload;
      state.loading = false;
    });

    builder.addCase(getTotalCredits.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //GEtCustomerCredits

    builder.addCase(getCustomerCredits.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getCustomerCredits.fulfilled, (state: any, action: any) => {
      state.creditCustomer = action.payload;
      state.loading = false;
    });

    builder.addCase(getCustomerCredits.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create Payment
    builder.addCase(createPyamentCredit.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(
      createPyamentCredit.fulfilled,
      (state: any, action: any) => {
        state.creditsList = state.creditsList.map((item: any) =>
          item.id === action.payload.id
            ? { ...state.creditsList, ...action.payload }
            : item,
        );
        state.loading = false;
      },
    );

    builder.addCase(createPyamentCredit.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default CreditSlice.reducer;
