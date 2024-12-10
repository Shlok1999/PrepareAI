import React from "react";
import { Timer } from "./Timer";

export function QuizLayout({ children, totalTime, onTimeUp }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Mock Test</h1>
            <Timer initialTime={totalTime} onTimeUp={onTimeUp} />
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
