import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProviders as getProvidersApi,
  createProvider as createProviderApi,
  updateProvider as updateProviderApi,
  deleteProvider as deleteProviderApi,
} from './../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getProviders = createAsyncThunk(
  'provider/getProviders',
  async () => {
    try {
      const { data } = await getProvidersApi();
      return data;
    } catch (error) {
      return error;
    }
  },
);

export const createProvider = createAsyncThunk(
  'provider/createProvider',
  async (provider: any) => {
    try {
      const resp = await createProviderApi(provider);
      toast.success('Proveedor creado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const updateProvider = createAsyncThunk(
  'provider/providerUpdate',
  async (provider: any) => {
    try {
      const response = await updateProviderApi(provider);
      toast.success('El provedor se actualizo con exito');
      return response;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const deleteProviderData = createAsyncThunk(
  'provider/delete',
  async (id: string) => {
    try {
      const resp = await deleteProviderApi(id);
      toast.success('Proveedor se elimino con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
