import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Axios base config
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

// ✅ Create Order Thunk
export const createNewOrder = createAsyncThunk(
    "order/createOrder",
    async (order, { rejectWithValue }) => {
        try {
            const response = await axios.post("/order/createOrder", order);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Order creation failed"
            );
        }
    }
);

// ✅ Fetch all my orders
export const getAllMyOrders = createAsyncThunk(
    "order/getAllMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/order/allMyOrders");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch all orders"
            );
        }
    }
);

// ✅ Fetch single order
export const getSingleOrder = createAsyncThunk(
    "order/getSingleOrder",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/order/getSingleOrder/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch order details"
            );
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        order: {},
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // ✅ Create order
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.order = action.payload?.order;
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Order creation failed";
            });

        // ✅ Get all my orders
        builder
            .addCase(getAllMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.orders = action.payload?.orders;
            })
            .addCase(getAllMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch orders";
            });

        // ✅ Get single order
        builder
            .addCase(getSingleOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success;
                state.order = action.payload?.order;
            })
            .addCase(getSingleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch order details";
            });
    },
});

// ✅ Export actions and reducer
export const { removeError, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
