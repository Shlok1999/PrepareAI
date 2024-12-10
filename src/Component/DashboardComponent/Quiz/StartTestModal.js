import React, { useState } from "react";
import { Clock, BookOpen, AlertTriangle } from "lucide-react";

export function StartTestModal({
  subject,
  duration,
  questionCount,
  onStart,
  onClose,
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 p-6">
        <div className="text-center mb-6">
          <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Practice Test: {subject}
          </h2>
          <p className="text-gray-600">
            These are practice questions to help you prepare for your upcoming
            test.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Duration</span>
            </div>
            <span className="font-medium">{duration} minutes</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Questions</span>
            </div>
            <span className="font-medium">{questionCount} questions</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              I understand that this is a practice test and agree to complete it
              honestly.
            </label>
          </div>

          <div className="flex items-start text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>
              You must complete in within 2 days
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            disabled={!agreed}
            className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
