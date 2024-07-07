import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12 max-h-[calc(100vh-41px)] overflow-auto">
      <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr] items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-300 animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-300 animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="w-48 h-8 bg-gray-300 animate-pulse"></div>
            <div className="w-36 h-5 bg-gray-300 animate-pulse"></div>
            <div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
            <div className="space-y-4">
              <div>
                <div className="w-44 h-7 bg-gray-300 animate-pulse mb-2"></div>
                <div className="grid gap-2">
                  <div className="w-full h-10 bg-gray-300 animate-pulse"></div>
                  <div className="w-full h-10 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="w-44 h-7 bg-gray-300 animate-pulse mb-4"></div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-md"></div>
                  <div>
                    <div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
                    <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300 animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-5 bg-gray-300 animate-pulse"></div>
                  <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-md"></div>
                  <div>
                    <div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
                    <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300 animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-5 bg-gray-300 animate-pulse"></div>
                  <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <div className="w-20 h-8 bg-gray-300 animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
