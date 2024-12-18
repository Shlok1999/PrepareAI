import React from "react";

export function ResultsModal({ isOpen, onClose, results }) {
  if (!isOpen) return null;

  const { attempted, correct, wrong, totalMarks } = results;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Results</h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Total Attempted:</strong> {attempted}
          </li>
          <li>
            <strong>Correct Answers:</strong> {correct}
          </li>
          <li>
            <strong>Wrong Answers:</strong> {wrong}
          </li>
          <li>
            <strong>Total Marks:</strong> {totalMarks} / {attempted * 4}
          </li>
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
