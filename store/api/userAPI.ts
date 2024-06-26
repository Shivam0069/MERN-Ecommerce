import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
} from "@/types/api-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/user`,
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["user"],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ adminUserId, userId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});
export const { useAllUsersQuery, useDeleteUserMutation } = userAPI;
