// lib/utils.ts
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { MessageResponse } from "../types/api-types";

type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
  res: ResType,
  router?: AppRouterInstance,
  url?: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);
    if (router && url) {
      router.push(url);
    }
  } else {
    const error = res.error as FetchBaseQueryError;
    const messageResponse = error.data as MessageResponse;
    toast.error(messageResponse.message);
  }
};

// export const getLastMonths = () => {
//   const currentDate = moment();

//   currentDate.date(1);

//   const last6Months: string[] = [];
//   const last12Months: string[] = [];

//   for (let i = 0; i < 6; i++) {
//     const monthDate = currentDate.clone().subtract(i, "months");
//     const monthName = monthDate.format("MMMM");
//     last6Months.unshift(monthName);
//   }

//   for (let i = 0; i < 12; i++) {
//     const monthDate = currentDate.clone().subtract(i, "months");
//     const monthName = monthDate.format("MMMM");
//     last12Months.unshift(monthName);
//   }

//   return {
//     last12Months,
//     last6Months,
//   };
// };
