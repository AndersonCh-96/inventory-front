import { createSlice } from '@reduxjs/toolkit';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from './thunk';

export const initialState: any = {
  productList: [],
  error: {},
  product: {},
  loading: false,
};

const ProductSlice = createSlice({
  name: 'ProductSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetProducts
    builder.addCase(getAllProducts.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getAllProducts.fulfilled, (state: any, action: any) => {
      state.productList = action.payload;
      state.loading = false;
    });

    builder.addCase(getAllProducts.rejected, (state: any, action: any) => {
      state.error = action.error;
      state.loading = false;
    });

    //GETONEPRODUCT

    builder.addCase(getOneProduct.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getOneProduct.fulfilled, (state: any, action: any) => {
      state.product = action.payload;
      state.loading = false;
    });

    builder.addCase(getOneProduct.rejected, (state: any, action: any) => {
      state.error = action.error;
      state.loading = false;
    });
    //Create Product

    builder.addCase(createProduct.pending, (state: any, action: any) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state: any, action: any) => {
      state.productList = [...state.productList, action.payload.data];
      state.loading = false;
    });

    builder.addCase(createProduct.rejected, (state: any, action: any) => {
      state.error = action.error;
      state.loading = false;
    });

    //UpdateProduct
    builder.addCase(updateProduct.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(updateProduct.fulfilled, (state: any, action: any) => {
      state.productList = state.productList.map((item: any) =>
        item.id === action.payload.data.id
          ? { ...state.productList, ...action.payload.data }
          : item,
      );
      state.loading = false;
    });

    builder.addCase(updateProduct.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //DeleteProduct

    builder.addCase(deleteProduct.pending, (state: any, action: any) => {
      state.loading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state: any, action: any) => {
      state.productList = state.productList.filter(
        (item: any) => item.id !== action.payload.data.id,
      );
      state.loading = false;
    });

    builder.addCase(deleteProduct.rejected, (state: any, action: any) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default ProductSlice.reducer;
