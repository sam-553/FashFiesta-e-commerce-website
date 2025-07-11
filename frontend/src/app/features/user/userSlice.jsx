const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const axios = require("axios");

// Axios base config
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Helper for cleaner error extraction
const extractError = (error, fallback) =>
    error.response?.data?.message || error.response?.data?.error || fallback;

// Thunks
export const register = createAsyncThunk("user/register", async (userdata, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/registerUser", userdata);
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Registration failed"));
    }
});

export const login = createAsyncThunk("user/login", async (userdata, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/loginUser", userdata);
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Login failed"));
    }
});

export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/user/getuserDetails");
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Failed to load profile"));
    }
});

export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/logout");
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Logout failed"));
    }
});

export const updateUser = createAsyncThunk("user/update", async (userdata, { rejectWithValue }) => {
    try {
        const response = await axios.put("/user/updateProfile", userdata);
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Profile update failed"));
    }
});

export const requestResetPassword = createAsyncThunk("user/requestResetPassword", async (userdata, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/requestresetpassword", userdata);
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Request reset password failed"));
    }
});

export const updatePassword = createAsyncThunk("user/updatePassword", async (userdata, { rejectWithValue }) => {
    try {
        const response = await axios.put("/user/updatePassword", userdata);
        return response.data;
    } catch (error) {
        return rejectWithValue(extractError(error, "Password update failed"));
    }
});

export const resetPassword =  createAsyncThunk(
  'user/resetPassword',
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const { data } = await axios.put(`/user/resetPassword/${token}`,{ password, confirmPassword },);
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Reset failed');
      console.log(error.response?.data?.message);
      
    }
  }
);


// Slice
const userSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        error: null,
        user: null,
        isAuthenticated: false,
        success: false,
        message: null
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
        resetUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        const setPending = (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        };
        const setRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        };

        // Register
        builder
            .addCase(register.pending, setPending)
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                state.success = action.payload?.success || true;
                state.error = null;
            })
            .addCase(register.rejected, setRejected)

            // Login
            .addCase(login.pending, setPending)
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                state.success = true;
                state.error = null;
            })
            .addCase(login.rejected, setRejected)

            // Load User
            .addCase(loadUser.pending, setPending)
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
                state.error = null;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Logout
            .addCase(logout.pending, setPending)
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.success = false;
                state.error = null;
            })
            .addCase(logout.rejected, setRejected)

            // Update User
            .addCase(updateUser.pending, setPending)
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || state.user;
                state.isAuthenticated = true;
                state.success = true;
                state.error = null;
            })
            .addCase(updateUser.rejected, setRejected)

            // Request Reset Password
            .addCase(requestResetPassword.pending, setPending)
            .addCase(requestResetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Request sent to your email";
                state.error = null;
            })
            .addCase(requestResetPassword.rejected, setRejected)

            // Update Password
            .addCase(updatePassword.pending, setPending)
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(updatePassword.rejected, setRejected)

            // Reset Password
            .addCase(resetPassword.pending, setPending)
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user=null;
                state.isAuthenticated=false
            })
            .addCase(resetPassword.rejected, setRejected);
    },
});

// Exports

export const { removeError, removeSuccess, resetUser } = userSlice.actions;
export const userActions = userSlice.actions;
export default userSlice.reducer;
