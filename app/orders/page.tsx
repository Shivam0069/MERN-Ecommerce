"use client";

import { useMyOrdersQuery } from "@/store/api/orderAPI";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Component() {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading } = useMyOrdersQuery(userData?._id!);
  console.log(data, "myOrders");
  const router = useRouter();
  return isLoading ? (
    <OrdersSkeleton />
  ) : (
    <div className="overflow-x-auto overflow-y-auto scrollbar-hide h-[calc(100vh-150px)] max-w-7xl mx-auto mt-10">
      <h2 className="text-4xl font-semibold mb-4 text-center">Orders</h2>
      <div className="grid gap-4">
        {data?.orders.map((order, orderIdx): any =>
          order.orderItems.map((product, productIdx) => (
            <div
              key={`${orderIdx}-${productIdx}`}
              onClick={() => router.push(`/order/${order._id}`)}
              className="flex items-center justify-between border rounded-lg p-4 cursor-pointer"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="text-sm text-muted-foreground flex flex-col justify-center gap-2">
                  <div>Order #{order._id.slice(-5)} </div>
                  <div>{order.createdAt?.split("T")[0]}</div>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto max-w-full scrollbar-hide">
                  <div className="flex items-center gap-4">
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
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium">
                  &#8377;{order.total.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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

const OrdersSkeleton = () => {
  return (
    <div className="overflow-x-auto overflow-y-auto scrollbar-hide h-[calc(100vh-150px)] max-w-7xl mx-auto mt-10">
      <h2 className="text-4xl font-semibold mb-4 text-center">Orders</h2>
      <div className="grid gap-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-24 h-5 bg-gray-300 rounded"></div>
                <div className="w-20 h-5 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
                <div>
                  <div className="w-24 h-5 bg-gray-300 rounded"></div>
                  <div className="w-12 h-5 bg-gray-300 rounded"></div>
                </div>
                <div className="w-0.5 h-14 bg-gray-300"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-5 bg-gray-300 rounded"></div>
              <div className="w-16 h-5 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
