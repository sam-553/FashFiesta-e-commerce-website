// cartSlice.js (fully corrected and clean)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Add to cart thunk
export const addtoCart = createAsyncThunk(
  "cart/addtoCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/product/getproductdetails/${id}`);
      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || "An error occurred"


      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems:
      typeof window !== "undefined" && localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    shippingInfo:
      typeof window !== "undefined" && localStorage.getItem("shippingInfo")
        ? JSON.parse(localStorage.getItem("shippingInfo"))
        : {},
    loading: false,
    success: false,
    error: null,
    message: null,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.product !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingInfo');

    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addtoCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addtoCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existCartItem = state.cartItems.find((i) => i.product === item.product);

        if (existCartItem) {
          existCartItem.quantity = item.quantity;
          state.message = `Updated ${item.name} quantity in cart successfully.`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} added to cart successfully.`;
        }

        state.loading = false;
        state.success = true;

        if (typeof window !== "undefined") {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        }
      })
      .addCase(addtoCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred while adding to cart.";
      });
  },
});

export const { removeError, removeMessage, removeFromCart, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
