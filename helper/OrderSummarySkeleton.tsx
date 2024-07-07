import React from "react";

const SkeletonOrderSummary = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-background rounded-lg border-t shadow-md p-6 mb-8">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-y-2">
          {Array.from({ length: 7 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="bg-background rounded-lg border-t shadow-md p-6 mb-8">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-y-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="bg-background rounded-lg border-t shadow-md p-6 mb-8">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <div className="h-8 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
};

export default SkeletonOrderSummary;
