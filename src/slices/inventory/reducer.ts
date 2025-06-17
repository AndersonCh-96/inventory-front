import { createSlice } from '@reduxjs/toolkit';
import { addAdjustment, getInventory, getInventoryMovement } from './thunk';
import { act } from 'react';

const initialState = {
  inventoryList: [],
  inventoryMovement: [],
  adjustment: {},
  error: {},
  loading: false,
};

const InventorySlice = createSlice({
  name: 'InventorySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInventory.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getInventory.fulfilled, (state: any, action: any) => {
      state.inventoryList = action.payload;
      state.loading = false;
    });

    builder.addCase(getInventory.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create Adjustment
    builder.addCase(addAdjustment.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(addAdjustment.fulfilled, (state: any, action: any) => {
      const { product, newStock } = action.meta.arg.adjustment;

      state.inventoryList = state.inventoryList.map((item: any) =>
        item.product.id === product ? { ...item, stock: newStock } : item,
      );
      state.loading = false;
    });

    builder.addCase(addAdjustment.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Get INventoryMovement
    builder.addCase(getInventoryMovement.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(
      getInventoryMovement.fulfilled,
      (state: any, action: any) => {
        state.inventoryMovement = action.payload;
        state.loading = false;
      },
    );

    builder.addCase(
      getInventoryMovement.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
        state.loading = false;
      },
    );
  },
});

export default InventorySlice.reducer;
