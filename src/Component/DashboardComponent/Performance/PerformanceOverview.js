import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

// Metrics data
const metrics = [
  { label: "Average Score", value: "82%", change: 5.2, trend: "up" },
  { label: "Tests Completed", value: "24", change: 8, trend: "up" },
  { label: "Accuracy Rate", value: "76%", change: 2.1, trend: "down" },
  { label: "Time per Question", value: "1.8m", change: 0.3, trend: "up" },
];

// PerformanceOverview Component
export function PerformanceOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm transition-transform transform hover:scale-105"
        >
          <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
            <div
              className={`flex items-center ${
                metric.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.trend === "up" ? (
                <ArrowUp className="h-4 w-4 mr-1" aria-label="Trend Up" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" aria-label="Trend Down" />
              )}
              <span className="text-sm">{metric.change.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
