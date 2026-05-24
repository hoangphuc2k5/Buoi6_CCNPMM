import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartApi, addToCartApi, updateCartApi, removeFromCartApi, clearCartApi } from "../util/api";

const initialState = {
    cart: null,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
    const response = await getCartApi();
    return response;
});

export const addItemToCart = createAsyncThunk("cart/addItemToCart", async ({ productId, quantity }) => {
    const response = await addToCartApi(productId, quantity);
    return response;
});

export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ productId, quantity }) => {
    const response = await updateCartApi(productId, quantity);
    return response;
});

export const removeItemFromCart = createAsyncThunk("cart/removeItemFromCart", async (productId) => {
    const response = await removeFromCartApi(productId);
    return response;
});

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
    const response = await clearCartApi();
    return response;
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCart: (state) => {
            state.cart = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.EC === 0) {
                    state.cart = action.payload.DT;
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                if (action.payload?.EC === 0) {
                    state.cart = action.payload.DT;
                }
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                if (action.payload?.EC === 0) {
                    state.cart = action.payload.DT;
                }
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                if (action.payload?.EC === 0) {
                    state.cart = action.payload.DT;
                }
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                if (action.payload?.EC === 0) {
                    state.cart = action.payload.DT;
                }
            });
    },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
