import {
  AllUsersResponse,
  CartDetailsResponse,
  DeleteUserRequest,
  MessageResponse,
} from "@/types/api-types";
import { CartSchema, NewCartRequest } from "@/types/reducer-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const cartAPI = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/cart`,
  }),
  tagTypes: ["cart"],
  endpoints: (builder) => ({
    cartData: builder.query<CartDetailsResponse, string>({
      query: () => `get`,
      providesTags: ["cart"],
    }),
    newCart: builder.mutation<MessageResponse, NewCartRequest>({
      query: ({ formData }) => ({
        url: `new`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});
export const { useCartDataQuery, useNewCartMutation } = cartAPI;
