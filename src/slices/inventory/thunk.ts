import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getInventory as getInventoryApi,
  getInventoryMovements as getInventoryMovementApi,
  addAdjustment as addAdjustmentApi,
} from '../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getInventory = createAsyncThunk('inventory/getAll', async () => {
  try {
    const { data } = await getInventoryApi();
    return data;
  } catch (error: any) {
    toast.error(error.message);
  }
});

export const getInventoryMovement = createAsyncThunk(
  'inventoryMovementt/get',
  async () => {
    try {
      const { data } = await getInventoryMovementApi();
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const addAdjustment = createAsyncThunk(
  'inventory/adjustment',
  async ({ adjustment }: any, { rejectWithValue }) => {
    try {
      const { data } = await addAdjustmentApi(adjustment);
      toast.success('Ajuste creado con éxito');
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return rejectWithValue(error);
    }
  },
);
