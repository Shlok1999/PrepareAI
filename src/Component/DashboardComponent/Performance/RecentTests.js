import React from 'react';
import { Clock, Target, TrendingUp } from 'lucide-react';

const recentTests = [
  {
    id: 1,
    name: 'Physics Mock Test 3',
    date: '2024-03-15',
    score: 85,
    time: '2h 45m',
    accuracy: '78%',
  },
  {
    id: 2,
    name: 'Chemistry Practice Set',
    date: '2024-03-14',
    score: 92,
    time: '1h 30m',
    accuracy: '85%',
  },
  {
    id: 3,
    name: 'Mathematics Quiz',
    date: '2024-03-13',
    score: 78,
    time: '1h 15m',
    accuracy: '72%',
  },
];

export function RecentTests() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
      <div className="space-y-4">
        {recentTests.map((test) => (
          <div key={test.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{test.name}</h4>
                <p className="text-sm text-gray-500">{test.date}</p>
              </div>
              <span className="text-lg font-semibold text-indigo-600">{test.score}/100</span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {test.time}
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                {test.accuracy}
              </div>
              <button className="flex items-center text-indigo-600 hover:text-indigo-700">
                <TrendingUp className="h-4 w-4 mr-1" />
                View Analysis
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}