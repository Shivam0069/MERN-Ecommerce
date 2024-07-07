import React from "react";

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

export default OrdersSkeleton;
