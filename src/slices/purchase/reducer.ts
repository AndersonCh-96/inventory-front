import { createSlice } from '@reduxjs/toolkit';
import {
  createPurchase,
  getPurchase,
  getPurchaseDetails,
  getTotalPurchase,
} from './thunk';

export const initialState: any = {
  purchaseList: [],
  purchaseDetails: {},
  totalPurchase: 0,
  error: {},
  loading: false,
};

const PurchaseSlice = createSlice({
  name: 'PurchaseSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetUser
    builder.addCase(getPurchase.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getPurchase.fulfilled, (state: any, action: any) => {
      state.purchaseList = action.payload;
      state.loading = false;
    });

    builder.addCase(getPurchase.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
    //GET TOTAL PURCHASEA
    builder.addCase(getTotalPurchase.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getTotalPurchase.fulfilled, (state: any, action: any) => {
      state.totalPurchase = action.payload;
      state.loading = false;
    });

    builder.addCase(getTotalPurchase.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
    //GetOnePurchases
    builder.addCase(getPurchaseDetails.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getPurchaseDetails.fulfilled, (state: any, action: any) => {
      state.purchaseDetails = action.payload;
      state.loading = false;
    });

    builder.addCase(getPurchaseDetails.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create User
    builder.addCase(createPurchase.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createPurchase.fulfilled, (state: any, action: any) => {
      state.purchaseList = [...state.purchaseList, action.payload.data];
      state.loading = false;
    });

    builder.addCase(createPurchase.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
    //UpdateUser

    //   builder.addCase(editUserData.pending, (state: any, action: any) => {
    //     state.loading = true;
    //   });

    //   builder.addCase(editUserData.fulfilled, (state: any, action: any) => {
    //     state.userList = state.userList.map((item: any) =>
    //       item.id === action.meta.arg.id
    //         ? { ...state.userList, ...action.meta.arg }
    //         : item,
    //     );
    //     state.loading = false;
    //   });

    //   builder.addCase(editUserData.rejected, (state: any, action: any) => {
    //     state.error = action.payload.error || null;
    //     state.loading = false;
    //   });

    //   //Delete User
    //   builder.addCase(deleteUserData.pending, (state: any, action: any) => {
    //     state.loading = true;
    //   });

    //   builder.addCase(deleteUserData.fulfilled, (state: any, action: any) => {

    //     state.userList = state.userList.filter(
    //       (item: any) => item.id !== action.meta.arg,
    //     );
    //     state.loading = false;
    //   });

    //   builder.addCase(deleteUserData.rejected, (state: any, action: any) => {
    //     state.error = action.payload.error || null;
    //     state.loading = false;
    //   });
  },
});

export default PurchaseSlice.reducer;
