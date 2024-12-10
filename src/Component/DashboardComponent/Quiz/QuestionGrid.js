import React from "react";
import { Flag, Check, AlertCircle } from "lucide-react";

export function QuestionGrid({
  totalQuestions,
  currentQuestion,
  answers,
  flaggedQuestions,
  onQuestionSelect,
}) {
  // Determine the status of each question
  const getQuestionStatus = (index) => {
    if (flaggedQuestions.has(index)) return "flagged";
    if (answers[index] !== null) return "answered";
    return "unanswered";
  };

  // Define classes based on the status of the question and its active state
  const getStatusClasses = (status, isActive) => {
    const baseClasses =
      "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors cursor-pointer";

    if (isActive) return `${baseClasses} bg-indigo-600 text-white`;

    switch (status) {
      case "flagged":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-300`;
      case "answered":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-300`;
      case "unanswered":
      default:
        return `${baseClasses} bg-white text-gray-600 border border-gray-300 hover:bg-gray-100`;
    }
  };

  // Icons for the question statuses
  const getStatusIcon = (status) => {
    switch (status) {
      case "flagged":
        return <Flag className="h-4 w-4" />;
      case "answered":
        return <Check className="h-4 w-4" />;
      case "unanswered":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Question Navigator
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const status = getQuestionStatus(i);
          const isActive = i === currentQuestion;

          return (
            <button
              key={i}
              onClick={() => onQuestionSelect(i)}
              className={getStatusClasses(status, isActive)}
              aria-label={`Question ${i + 1}: ${status}`}
            >
              <span className="mr-1">{i + 1}</span>
              {getStatusIcon(status)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
