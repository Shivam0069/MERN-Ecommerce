import { CartReducerInitialState } from "@/types/reducer-types";
import {
  AddShippingAddress,
  AddToCart,
  CartItem,
  CartItemWithId,
  CartSlice,
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

const saveCartData = (
  state: CartReducerInitialState,
  user: string | undefined
) => {
  if (user === undefined) {
    localStorage.setItem("cartData", JSON.stringify(state));
  }
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
          user: user?._id,
          cartItems: mergedCartItems,
          shippingCharges: dbCartData.shippingCharges + shippingCharges,
          tax: dbCartData.tax + tax,
          total: dbCartData.total + total,
          subtotal: dbCartData.subtotal + subtotal,
          discount: dbCartData.discount + discount,
          shippingInfo: dbCartData.shippingInfo,
        };
        console.log("merge");
        localStorage.removeItem("cartData");
        return mergeData;
      } else {
        console.log(state.cart, "Notmerge");

        console.log("Notmerge");

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

const updateCart = async (
  state: CartReducerInitialState,
  user: string | undefined
) => {
  if (user !== undefined) {
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
  }
};

const calculatePriceOfCart = (
  state: CartReducerInitialState,
  user: string | undefined
) => {
  let subtotal = 0;
  state.cartItems.forEach((i: CartItem) => {
    subtotal += i.price * i.quantity;
  });

  state.subtotal = subtotal;
  state.tax = Math.round(state.subtotal * 0.18);
  state.shippingCharges = subtotal === 0 ? 0 : subtotal < 2000 ? 200 : 0;

  state.total =
    state.subtotal + state.tax + state.shippingCharges - state.discount;
  saveCartData(state, user);
  updateCart(state, user);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCart>) => {
      state.loading = true;
      const itemIndex = state.cartItems.findIndex(
        (i) => i.productId === action.payload.cartItem.productId
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex] = action.payload.cartItem;
      } else {
        state.cartItems.push(action.payload.cartItem);
      }
      state.loading = false;
      calculatePriceOfCart(state, action.payload.user);
    },
    removeCartItem: (
      state,
      action: PayloadAction<{ productId: string; user: string | undefined }>
    ) => {
      state.loading = true;
      const itemIndex = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
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
      calculatePriceOfCart(state, action.payload.user);
    },
    deleteCartItem: (
      state,
      action: PayloadAction<{ productId: string; user: string | undefined }>
    ) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i: CartItem) => i.productId !== action.payload.productId
      );
      state.discount = 0;
      state.loading = false;
      calculatePriceOfCart(state, action.payload.user);
    },
    deleteCart: (state, action: PayloadAction<string | undefined>) => {
      state.loading = true;
      state.cartItems = [];

      state.loading = false;
      calculatePriceOfCart(state, action.payload);
    },

    applyCoupon: (
      state,
      action: PayloadAction<{ discount: number; user: string | undefined }>
    ) => {
      state.loading = true;
      state.discount = action.payload.discount;
      state.loading = false;
      calculatePriceOfCart(state, action.payload.user);
    },
    addShippingAddress: (state, action: PayloadAction<AddShippingAddress>) => {
      state.loading = true;
      state.shippingInfo = action.payload.shipping;
      state.loading = false;
      calculatePriceOfCart(state, action.payload.user);
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
        updateCart(state, action.payload.user);
      })
      .addCase(fetchCartDbData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred.";
      });
  },
});

export const {
  addToCart,
  removeCartItem,
  deleteCart,
  deleteCartItem,
  applyCoupon,
  addShippingAddress,
} = cartSlice.actions;

export default cartSlice.reducer;
