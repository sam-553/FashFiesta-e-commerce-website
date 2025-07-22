// --- src/app/features/products/productSlice.js ---
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/product';

// Fetch product list with optional filters
export const getproduct = createAsyncThunk(
  'product/getproduct',
  async ({ keyword = '', page = 1, category = '' }, thunkAPI) => {
    try {
      const query = [
        keyword && `keyword=${encodeURIComponent(keyword)}`,
        `page=${page}`,
        category && `category=${encodeURIComponent(category)}`,
      ].filter(Boolean).join('&');

      const { data } = await axios.get(`${BASE_URL}/getAllProduct?${query}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);


// Fetch product details
export const getproductDetails = createAsyncThunk(
  'product/getproductDetails',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/getproductdetails/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Create product review
export const createReview = createAsyncThunk(
  'product/createReview',
  async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/createReviewForProduct`,
        { rating, comment, productId },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while adding your review'
      );
    }
  }
);

const ProductSlice = createSlice({
  name: 'product',
  initialState: {
    product: [],
    productDetails: null,
    productCount: 0,
    loading: false,
    error: null,
    resultPerPage: 0,
    totalpages: 0,
    reviewLoading: false,
    reviewSuccess: false,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Product List
      .addCase(getproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product || [];
        state.productCount = action.payload.productCount || 0;
        state.resultPerPage = action.payload.resultPerPage || 0;
        state.totalpages = action.payload.totalpages || 0;
      })
      .addCase(getproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Product Details
      .addCase(getproductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getproductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload.product || null;
      })
      .addCase(getproductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Create Review
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { removeError, removeSuccess } = ProductSlice.actions;
export default ProductSlice.reducer;
