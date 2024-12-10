import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Navigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
}) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </button>

      <span className="text-sm text-gray-500">
        Question {currentQuestion + 1} of {totalQuestions}
      </span>

      {currentQuestion === totalQuestions - 1 ? (
        <button
          onClick={onSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Submit Test
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      )}
    </div>
  );
}
