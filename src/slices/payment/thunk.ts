import { createAsyncThunk } from '@reduxjs/toolkit';
import { createPaymenCredit as createPaymenCreditApi } from '../../helpers/api_backend';
import toast from 'react-hot-toast';

export const createPyamentCredit = createAsyncThunk(
  'paymente/create',
  async (payment: any, { rejectWithValue }) => {
    try {
      const data = await createPaymenCreditApi(payment);
      toast.success('Pago registrado');
      return data;
    } catch (error: any) {
      toast.error(error.response.data);
      return rejectWithValue(error);
    }
  },
);
