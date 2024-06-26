import {
  BarResponse,
  LineResponse,
  PieResponse,
  StatsResponse,
} from "@/types/api-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard",
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query<StatsResponse, string>({
      query: (id) => `stats?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    getBarStats: builder.query<BarResponse, string>({
      query: (id) => `bar?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    getLineStats: builder.query<LineResponse, string>({
      query: (id) => `line?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    getPieStats: builder.query<PieResponse, string>({
      query: (id) => `pie?id=${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetBarStatsQuery,
  useGetLineStatsQuery,
  useGetPieStatsQuery,
} = dashboardAPI;
