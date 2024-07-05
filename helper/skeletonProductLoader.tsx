import React from "react";

export default function SkeletonProductLoader({ n }: { n: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border-t shadow-lg overflow-hidden animate-pulse mb-4"
        >
          <div className="w-full h-60 bg-gray-300"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ))}
    </>
  );
}
