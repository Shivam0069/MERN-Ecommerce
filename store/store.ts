import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { cartAPI } from "./api/cartAPI";
import { dashboardAPI } from "./api/dashboardAPI";
import { orderAPI } from "./api/orderAPI";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import cartReducer from "./slice/cartSlice";
import userReducer, { fetchUserData } from "./slice/userSlice";
export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [cartAPI.reducerPath]: cartAPI.reducer,
    user: userReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productAPI.middleware,
      userAPI.middleware,
      orderAPI.middleware,
      dashboardAPI.middleware,
      cartAPI.middleware
    ),
});

setupListeners(store.dispatch);
store.dispatch(fetchUserData());
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
