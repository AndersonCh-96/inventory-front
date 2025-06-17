import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSales as getSalesApi,
  createSale as createSaleApi,
  getDetailSale as getDetailSaleApi,
  getTotalSales as getTotalSalesApi,
} from './../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getSales = createAsyncThunk('sales/getSales', async () => {
  try {
    const { data } = await getSalesApi();
    return data;
  } catch (error: any) {
    toast.error(error.message);
    return error;
  }
});

export const getTotalSales = createAsyncThunk(
  'sales/getTotalSales',
  async () => {
    try {
      const { data } = await getTotalSalesApi();

      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
export const getDetailSale = createAsyncThunk(
  'sales/getDetailSale',
  async (id: any) => {
    try {
      const { data } = await getDetailSaleApi(id);

      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async ({ data, navigate }: any, { rejectWithValue }) => {
    try {
      const resp = await createSaleApi(data);
      toast.success('Venta realizada');
      navigate('/sales');
      return resp;
    } catch (error: any) {
      toast.error(error.response.data);
      return rejectWithValue(error.response);
    }
  },
);
