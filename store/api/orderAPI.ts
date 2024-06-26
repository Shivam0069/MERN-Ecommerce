import {
  AllOrdersResponse,
  DeleteOrderRequest,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrderRequest,
} from "@/types/api-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderAPI = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/order`,
  }),
  tagTypes: ["order"],

  endpoints: (builder) => ({
    myOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => `my?id=${id}`,
      providesTags: ["order"],
    }),
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (formData) => ({
        url: "new",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["order"],
    }),
    allOrder: builder.query<AllOrdersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["order"],
    }),
    getOrderById: builder.query<OrderDetailsResponse, string>({
      query: (id) => `${id}`,
      providesTags: ["order"],
    }),
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ orderId, userId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["order"],
    }),
    deleteOrder: builder.mutation<MessageResponse, DeleteOrderRequest>({
      query: ({ orderId, userId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useMyOrdersQuery,
  useNewOrderMutation,
  useAllOrderQuery,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} = orderAPI;
