import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const subjectData = [
  { subject: 'Physics', score: 85, average: 75 },
  { subject: 'Chemistry', score: 72, average: 70 },
  { subject: 'Mathematics', score: 90, average: 78 },
  { subject: 'Biology', score: 78, average: 72 },
];

export function SubjectPerformance() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={subjectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#4f46e5" name="Your Score" />
            <Bar dataKey="average" fill="#e5e7eb" name="Class Average" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}