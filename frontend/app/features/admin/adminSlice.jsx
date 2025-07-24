

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Axios config
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;




// Thunk for fetching admin products
export const fetchAdminProducts = createAsyncThunk(
    'admin/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/product/getAdminProducts');
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to fetch products"));
        }
    }
);
export const uploadProducts = createAsyncThunk(
    'admin/uploadProducts',
    async (productData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/product/addproduct', productData);
            return data;
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to fetch products"));
        }
    }
);
// delete product
export const deleteProduct = createAsyncThunk(

    'admin/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/product/deleteproduct/${id}`);
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to delete products"));
        }
    }
);
//update product
export const updateProduct = createAsyncThunk(

    'admin/updateProduct',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/product/updateproduct/${id}`, formData);
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to update products"));
        }
    }
);

// fetchAllUsers
export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/user/getUsersList');
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to fetch Users"));
        }
    }
);
// delete user
export const deleteuser = createAsyncThunk(

    'admin/deleteuser',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/user/deleteUser/${id}`);
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to delete user"));
        }
    }
);
// get single user
export const getSingleUser = createAsyncThunk(

    'admin/getSingleUser',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/user/getSingleUser/${id}`);
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to fetch getSingleUser"));
        }
    }
);

//update user
export const updateUserRole = createAsyncThunk(

    'admin/updateUserRole',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/user/updateUserRole/${id}`, formData);
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue(extractError(error, "Failed to update user"));
        }
    }
);

// fetch All order
export const fetchAllOrders = createAsyncThunk(
    'admin/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/order/getAllOrders');
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue((error.response?.data?.message || error.message || "Failed to fetch order"));
        }
    }
);
//updateOrderStatus
export const updateOrderStatus = createAsyncThunk(
    'admin/updateOrderStatus',
    async ({ orderId, status }, thunkAPI) => {
        try {
            const { data } = await axios.put(`/order/updateOrderStatus/${orderId}`, { status });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message || 'Error updating order');
        }
    }
);

//delete orders
export const deleteOrder = createAsyncThunk(
    'admin/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/order/deleteOrder/${id}`);
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue((error.response?.data?.message || error.message || "Failed to delete order"));
        }
    }
);

// reviews
export const fetchAllReviews = createAsyncThunk(
    'admin/fetchAllReviews',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/product/getProductReviews');
            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue((error.response?.data?.message || error.message || "Failed to fetch reviews"));
        }
    }
);
export const deleteReviews = createAsyncThunk(
    'admin/deleteReviews',
    async ({ productId, reviewId }, { rejectWithValue }) => {
        try {
            await axios.delete(`/product/deleteReview/${productId}/${reviewId}`);


            return data; // should return { success, products }
        } catch (error) {
            return rejectWithValue((error.response?.data?.message || error.message || "Failed to fetch reviews"));
        }
    }
);
export const fetchSingleProductReviews = createAsyncThunk(
    'admin/fetchSingleProductReviews',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/product/getSingleProductReviews/${productId}`);
            return data; // { success, reviews }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch product reviews");
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        users: [],
        loading: false,
        error: null,
        success: false,
        product: {},
        user: {},
        message: null,
        orders: [],
        order: {},
        reviews: [],
        review: {},
        totalAmount: 0
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
        clearmessage: (state) => {
            state.message = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || [];

            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to fetch products';
            });

        //upload products
        builder
            .addCase(uploadProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload.product);


                state.success = action.payload?.success || true;
                state.error = null;
            })
            .addCase(uploadProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to create products';
            });
        //update product
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload?.product;
                if (updatedProduct && updatedProduct._id) {
                    state.products = state.products.map((prod) =>
                        prod._id === updatedProduct._id ? updatedProduct : prod
                    );
                }
                state.success = action.payload?.success || true;
                state.error = null;
            })


            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;

                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to update products';
            });






        //delete products
        builder.addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.deletedProductId; // ensure backend sends this
                state.products = state.products.filter(prod => prod._id !== deletedId);
                state.success = true;
            })

            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to fetch products';
            });
        //  fetchAllUsers
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users || [];

            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to fetch Users';
            });
        //getSingleUser
        builder
            .addCase(getSingleUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || {};

            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to fetch Users';
            });

        // delete user
        builder.addCase(deleteuser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteuser.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.deleteduserId; // ensure backend send this
                state.users = state.users.filter(user => user._id !== deletedId);
                state.success = true;
            })

            .addCase(deleteuser.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to fetch products';
            });

        //updateUser

        builder
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;

                state.success = action.payload?.success || true;
                state.message = action.payload?.message || true;

            })

            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;

                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to update products';
            });
        //fetchAllOrders
        // fetchAllOrders
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.totalAmount = 0; // optional reset
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || [];
                state.totalAmount = state.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to fetch orders';
            });

        //delete order
        builder
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.deleteduserId; // ensure backend send this
                state.orders = state.orders.filter(order => order._id !== deletedId);
                state.success = true;

            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to delete orders';
            });
        //updateOrderStatus
        builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;


                state.success = action.payload?.success || true;
                state.order = action.payload?.order;
                state.error = null;
            })

            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;

                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to update products';
            });

        //fetchAllReviews
        builder
            .addCase(fetchAllReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReviews.fulfilled, (state, action) => {
                state.loading = false;


                state.success = action.payload?.success || true;
                state.reviews = action.payload?.reviews;
                state.error = null;
            })

            .addCase(fetchAllReviews.rejected, (state, action) => {
                state.loading = false;

                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to update products';
            });

        //delete review
        builder.addCase(deleteReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const deletedId = action.payload.deletedReviewId; // Ensure backend sends this
                state.reviews = state.reviews.filter(review => review._id !== deletedId);
            })
            .addCase(deleteReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Failed to delete review';
            })

        builder
            .addCase(fetchSingleProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload?.success || true;
                state.review = action.payload?.review;
            })
            .addCase(fetchSingleProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch product reviews";
            });




    },
});

export const { removeError, removeSuccess, clearmessage } = adminSlice.actions;
export default adminSlice.reducer;
