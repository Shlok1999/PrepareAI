import React from 'react';
import { Clock, FileText, BarChart } from 'lucide-react';

export function TestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tests</h1>

      <div className="grid gap-6">
        {[
          {
            name: 'Physics Full Mock Test',
            duration: '3 hours',
            questions: 90,
            topics: ['Mechanics', 'Thermodynamics', 'Optics'],
          },
          {
            name: 'Chemistry Practice Set',
            duration: '2 hours',
            questions: 60,
            topics: ['Organic Chemistry', 'Physical Chemistry'],
          },
          {
            name: 'Mathematics Quiz',
            duration: '1.5 hours',
            questions: 45,
            topics: ['Calculus', 'Algebra', 'Trigonometry'],
          },
        ].map((test, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {test.duration}
                  </span>
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {test.questions} questions
                  </span>
                </div>
                <div className="mt-2">
                  {test.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-block bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full mr-2 mt-2"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analysis
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Start Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}