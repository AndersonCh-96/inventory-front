import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPaymenCredit,
  getCredits as getCreditsApi,
  getCustomerCredits as getCustomerCteditsApi,
  getTotalCredits as getTotalCreditsApi,
} from './../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getCredits = createAsyncThunk('credits/getCredits', async () => {
  try {
    const { data } = await getCreditsApi();
    return data;
  } catch (error: any) {
    toast.error(error.message);
    return error;
  }
});

export const getTotalCredits = createAsyncThunk(
  'credits/total',
  async ({ rejectWithValue }: any) => {
    try {
      const { data } = await getTotalCreditsApi();
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const getCustomerCredits = createAsyncThunk(
  'credits/getCustomerCredits',
  async (customerId: string) => {
    try {
      const { data } = await getCustomerCteditsApi(customerId);
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const createPyamentCredit = createAsyncThunk(
  'credits/paymentCreate',
  async (payment: any, { rejectWithValue }) => {
    try {
      const { data } = await createPaymenCredit(payment);
      toast.success('Pago registrado');
      return data;
    } catch (error: any) {
      toast.error(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
