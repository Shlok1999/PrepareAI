import React from "react";

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-indigo-600 font-semibold text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default Loader;
