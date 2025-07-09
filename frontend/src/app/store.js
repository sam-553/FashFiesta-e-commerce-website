
const { configureStore } = require("@reduxjs/toolkit");
import productReducer from './features/products/productSlice';
const { userReducer } = require("./features/user/userSlice");
import cartReducer from '@/app/features/cart/cartSlice';
import orderReducer from '@/app/features/order/orderSlice';
import adminReducer from '@/app/features/admin/adminSlice';


export const store = configureStore({
    reducer: {
        product: productReducer,
        user:userReducer,
        cart: cartReducer,
        order: orderReducer,
        admin:adminReducer,
    }
})