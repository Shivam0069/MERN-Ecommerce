import React from "react";

function SkeletonProductDetailLoader() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-4">
        <div className="w-full h-[400px] bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
      <div className="grid gap-4">
        <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse mb-4"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="flex items-baseline gap-4">
          <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="grid gap-2">
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-12 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      <div className="col-span-2 grid gap-8">
        <div className="grid gap-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="grid gap-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
                <div className="p-4 bg-background">
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonProductDetailLoader;
