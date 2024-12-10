import React from "react";
import { Flag } from "lucide-react";

export function Question({
  question,
  selectedAnswer,
  isFlagged,
  onAnswerSelect,
  onFlag,
}) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {question.id}. {question.question_text}
        </h2>
        <button
          onClick={onFlag}
          className={`p-2 rounded-lg transition-colors ${
            isFlagged
              ? "bg-yellow-50 text-yellow-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Flag className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === index
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-3 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
