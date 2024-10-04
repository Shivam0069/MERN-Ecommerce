import React from "react";

export default function Loader() {
  return (
    <>
      <div className="load-bar">
        <div className="bars"></div>
        <div className="bars"></div>
        <div className="bars"></div>
      </div>
    </>
  );
}

export function CircleLoader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader />
      <button
        disabled
        type="button"
        className="text-sm p-2 px-7 font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center animate-pulse"
      >
        Loading...
      </button>
    </div>
  );
}
