import { createSlice } from '@reduxjs/toolkit';
import { createPyamentCredit } from './thunk';

const initialState = {
  payment: {},
  error: {},
  loading: false,
};

const PaymentSlice = createSlice({
  name: 'PaymentSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Create Payment
    builder.addCase(createPyamentCredit.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(
      createPyamentCredit.fulfilled,
      (state: any, action: any) => {
        state.payment = [...state.payment, action.meta.arg];
        state.loading = false;
      },
    );

    builder.addCase(createPyamentCredit.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default PaymentSlice.reducer;
