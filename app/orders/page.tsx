"use client";

import { CircleLoader } from "@/helper/loader";
import { useMyOrdersQuery } from "@/store/api/orderAPI";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Component() {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading } = useMyOrdersQuery(userData?._id!);
  console.log(data, "myOrders");

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6  ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {/* <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div> */}
      </div>
      {isLoading ? (
        <div className="w-screen flex justify-center items-center h-[calc(100vh-41px)]">
          <CircleLoader />
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto scrollbar-hide h-[calc(100vh-150px)]">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Order
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Items
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 dark:border-gray-800"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/order/${order._id}`}
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {order.createdAt?.split("T")[0]}
                  </td>
                  <td className="px-4 py-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index}>
                        {item.quantity} x {item.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    &#8377;{order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {order.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
