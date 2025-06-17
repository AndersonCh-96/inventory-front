import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  getProducts as getProductsApi,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  getOneProduct as getOneProductApi,
} from '../../helpers/api_backend';

export const getAllProducts = createAsyncThunk(
  'products/getProducts',
  async () => {
    try {
      const { data } = await getProductsApi();
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const getOneProduct = createAsyncThunk(
  'product/getOneProduct',
  async ({ id }: any, { rejectWithValue }) => {
    try {
      const {data} = await getOneProductApi(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async ({ product, modal }: any, { rejectWithValue }) => {
    try {
      const resp = await createProductApi(product);
      toast.success('Producto creado con exito');
      modal(false);
      return resp;
    } catch (error: any) {
      toast.error(error.response.data);
      return rejectWithValue(error.response);
    }
  },
);

export const updateProduct = createAsyncThunk(
  'product/ updateProduct',
  async ({ product, id, modal }: any) => {
    try {
      const resp = await updateProductApi(product, id);
      toast.success('Producto actualizado con exito');
      modal(false);
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'product/updateProduct',
  async (id: string) => {
    try {
      const resp = await deleteProductApi(id);
      toast.success('Producto se elimino con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
