import { CartReducerInitialState } from "@/types/reducer-types";
import {
  CartItem,
  CartItemWithId,
  CartSlice,
  ShippingInfo,
} from "@/types/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const initialState: CartReducerInitialState = {
  loading: false,

  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  message: "",
  error: null,
};

const saveCartData = (state: CartReducerInitialState) => {
  localStorage.setItem("cartData", JSON.stringify(state));
};

export const fetchCartDbData = createAsyncThunk<
  CartReducerInitialState,
  void,
  { state: RootState }
>("cart/fetchCartData", async (_, { getState }) => {
  try {
    // Accessing state data
    const state = getState();
    const { cartItems, shippingCharges, tax, total, subtotal, discount } =
      state.cart;
    const user = state.user.userData;
    if (user?._id) {
      const response = await axios.get("/api/cart/get");
      console.log(response.data);
      const dbCartData = response?.data?.cart;

      if (cartItems.length > 0) {
        const mergedCartItems = dbCartData.cartItems.map(
          (item: CartItemWithId) => ({
            ...item,
          })
        );

        for (let i = 0; i < cartItems.length; i++) {
          const index = mergedCartItems.findIndex(
            (item: CartItemWithId) => item.productId === cartItems[i].productId
          );
          if (index !== -1) {
            mergedCartItems[index].quantity += cartItems[i].quantity;
          } else {
            mergedCartItems.push(cartItems[i]);
          }
        }

        const mergeData: CartSlice = {
          cartItems: mergedCartItems,
          shippingCharges: dbCartData.shippingCharges + shippingCharges,
          tax: dbCartData.tax + tax,
          total: dbCartData.total + total,
          subtotal: dbCartData.subtotal + subtotal,
          discount: dbCartData.discount + discount,
          shippingInfo: dbCartData.shippingInfo,
        };
        return mergeData;
      } else {
        return response.data.cart;
      }
    } else {
      const savedCartData = localStorage?.getItem("cartData");
      if (savedCartData) {
        console.log(JSON.parse(savedCartData), "cartDatafetched from local");

        return JSON.parse(savedCartData);
      }
      return initialState;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const updateCart = async (state: CartReducerInitialState) => {
  try {
    const cartData = {
      cartItems: state.cartItems,
      total: state.total,
      shippingInfo: state.shippingInfo,
      subtotal: state.subtotal,
      tax: state.tax,
      shippingCharges: state.shippingCharges,
      discount: state.discount,
    };
    const res = await axios.put(`/api/cart/update`, cartData);
    console.log(res, "updateCartRes");
  } catch (error) {
    console.log(error);
  }
};

const calculatePriceOfCart = (state: CartReducerInitialState) => {
  let subtotal = 0;
  state.cartItems.forEach((i: CartItem) => {
    subtotal += i.price * i.quantity;
  });

  state.subtotal = subtotal;
  state.tax = Math.round(state.subtotal * 0.18);
  state.shippingCharges = subtotal === 0 ? 0 : subtotal < 2000 ? 200 : 0;

  state.total =
    state.subtotal + state.tax + state.shippingCharges - state.discount;

  saveCartData(state);
  updateCart(state);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartSlice>) => {
      state.loading = true;
      state.cartItems = action.payload.cartItems;
      state.tax = action.payload.tax;
      state.discount = action.payload.discount;
      state.shippingCharges = action.payload.shippingCharges;
      state.total = action.payload.total;
      state.shippingInfo = action.payload.shippingInfo;
      state.subtotal = action.payload.subtotal;
      state.loading = false;
      calculatePriceOfCart(state);
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;
      const itemIndex = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex] = action.payload;
      } else {
        state.cartItems.push(action.payload);
      }
      state.loading = false;
      calculatePriceOfCart(state);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      const itemIndex = state.cartItems.findIndex(
        (i) => i.productId === action.payload
      );
      if (itemIndex !== -1) {
        if (state.cartItems[itemIndex].quantity > 1) {
          state.cartItems[itemIndex].quantity -= 1;
        } else {
          state.cartItems.splice(itemIndex, 1);
        }
      }
      state.discount = 0;
      state.loading = false;
      calculatePriceOfCart(state);
    },
    deleteCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i: CartItem) => i.productId !== action.payload
      );
      state.discount = 0;
      state.loading = false;
      calculatePriceOfCart(state);
    },
    deleteCart: (state) => {
      state.loading = true;
      state.cartItems = [];

      state.loading = false;
      calculatePriceOfCart(state);
    },

    applyCoupon: (state, action: PayloadAction<number>) => {
      state.loading = true;
      state.discount = action.payload;
      state.loading = false;
      calculatePriceOfCart(state);
    },
    addShippingAddress: (state, action: PayloadAction<ShippingInfo>) => {
      state.loading = true;
      state.shippingInfo = action.payload;
      state.loading = false;
      calculatePriceOfCart(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartDbData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartDbData.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.tax = action.payload.tax;
        state.discount = action.payload.discount;
        state.shippingCharges = action.payload.shippingCharges;
        state.total = action.payload.total;
        state.shippingInfo = action.payload.shippingInfo;
        state.message = action.payload.message;
        state.subtotal = action.payload.subtotal;

        state.loading = false;
        updateCart(state);
      })
      .addCase(fetchCartDbData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred.";
      });
  },
});

export const {
  setCart,
  addToCart,
  removeCartItem,
  deleteCart,
  deleteCartItem,
  applyCoupon,
  addShippingAddress,
} = cartSlice.actions;

export default cartSlice.reducer;
