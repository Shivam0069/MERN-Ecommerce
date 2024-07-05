"use client";

import { CircleLoader } from "@/helper/loader";
import { useMyOrdersQuery } from "@/store/api/orderAPI";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Component() {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading } = useMyOrdersQuery(userData?._id!);
  console.log(data, "myOrders");
  const router = useRouter();
  return isLoading ? (
    <div className="w-screen flex justify-center items-center h-[calc(100vh-41px)]">
      <CircleLoader />
    </div>
  ) : (
    <div className="overflow-x-auto overflow-y-auto scrollbar-hide h-[calc(100vh-150px)] max-w-7xl mx-auto mt-10">
      <h2 className="text-4xl font-semibold mb-4 text-center">Orders</h2>
      <div className="grid gap-4">
        {data?.orders.map((item, idx) => (
          <div
            onClick={() => router.push(`/order/${item._id}`)}
            key={idx}
            className="flex items-center justify-between border rounded-lg p-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground flex flex-col justify-center gap-2">
                <div>Order #{item._id.slice(0, 5)}... </div>
                <div>{item.createdAt?.split("T")[0]}</div>
              </div>

              {item.orderItems.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img
                    src={product.photo}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <div>
                    <div className="font-medium">
                      {product.name} x {product.quantity}
                    </div>
                  </div>
                  <div className="w-0.5 h-14 border"></div>
                </div>
              ))}
            </div>

            <div className="text-right">
              <div className="font-medium">&#8377;{item.total.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{item.status}</div>
            </div>
          </div>
        ))}
        {data?.orders.length! === 0 && (
          <div className="text-xl text-center">Nothing to show</div>
        )}
      </div>
      {/* <table className="w-full table-auto">
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
          </table> */}
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
