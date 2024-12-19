import React from "react";

export function DashboardLoader() {
  return (
    <div className="animate-pulse">
      {/* Welcome Section */}
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tests Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b"
              >
                <div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tests Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b"
              >
                <div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
