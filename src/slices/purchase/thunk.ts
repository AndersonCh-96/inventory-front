import toast from 'react-hot-toast';
import {
  getPurchase as getPurchaseApi,
  getTotalPurchases as getTotalPurchasesApi,
  createPurchase as createPurchaseApi,
  getPurchaseDetails as getPurchaseDetailsApi,
} from './../../helpers/api_backend';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const getPurchase = createAsyncThunk(
  'purchase/getPurchase',
  async () => {
    try {
      const { data } = await getPurchaseApi();
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const getTotalPurchase = createAsyncThunk(
  'purchase/getTotalPurchase',
  async () => {
    try {
      const { data } = await getTotalPurchasesApi();
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
export const getPurchaseDetails = createAsyncThunk(
  'purchase/getPurchaseDetail',
  async (purchaseId: string) => {
    try {
      const { data } = await getPurchaseDetailsApi(purchaseId);
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
export const createPurchase = createAsyncThunk(
  'purchase/createPurchase',
  async (purchase: any) => {
    try {
      const resp = await createPurchaseApi(purchase);
      toast.success('Compra realizada');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
