//  Request to server
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  editUser as editUserApi,
  getUsers as getUserApi,
  createUser as createUserApi,
  deleteUser as deleteUserApi,
} from '../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getUser = createAsyncThunk('user/getUser', async () => {
  try {
    const { data } = await getUserApi();
    return data;
  } catch (error) {
    return error;
  }
});

export const createUser = createAsyncThunk(
  'user/createUser',
  async (user: any, { rejectWithValue }) => {
    try {
      const resp = await createUserApi(user);
      toast.success('Usuario creado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.response.data);
      return rejectWithValue(error.response);
    }
  },
);

export const editUserData = createAsyncThunk(
  'user/editUser',
  async (user: any) => {
    try {
      const response = await editUserApi(user);
      toast.success('El usuario se actualizo con exito');
      return response;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const deleteUserData = createAsyncThunk(
  'user/delete',
  async (id: string) => {
    try {
      const resp = await deleteUserApi(id);
      toast.success('Usuario se elimino con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
