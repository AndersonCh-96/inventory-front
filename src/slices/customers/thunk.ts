import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCustomers as getCustomersApi,
  createCustomer as createCustomersApi,
  updateCustomer as updateCustomersApi,
  deleteCustomer as deleteCustomerApi,
} from '../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async () => {
    try {
      const { data } = await getCustomersApi();
      return data;
    } catch (error) {
      return error;
    }
  },
);

export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (customer: any) => {
    try {
      const resp = await createCustomersApi(customer);
      toast.success('Cliente creado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async (customer: any) => {
    try {
      const resp = await updateCustomersApi(customer);
      toast.success('Cliente actualizado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id: any) => {
    try {
      const resp = await deleteCustomerApi(id);
      toast.success('Cliente eliminado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.response.data);
      return error.message;
    }
  },
);
