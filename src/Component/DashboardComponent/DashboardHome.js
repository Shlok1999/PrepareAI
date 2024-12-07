import React from 'react';
import { BookOpen, Users, Clock, Trophy } from 'lucide-react';

export function DashboardHome() {
  const stats = [
    { icon: BookOpen, label: 'Tests Completed', value: '24' },
    { icon: Clock, label: 'Study Hours', value: '156' },
    { icon: Users, label: 'Global Rank', value: '#234' },
    { icon: Trophy, label: 'Achievements', value: '12' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, Student!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h2>
          <div className="space-y-4">
            {[
              { name: 'Physics Mock Test 3', score: '85/100', date: '2024-03-15' },
              { name: 'Chemistry Practice Set', score: '92/100', date: '2024-03-14' },
              { name: 'Mathematics Quiz', score: '78/100', date: '2024-03-13' },
            ].map((test, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">{test.name}</p>
                  <p className="text-sm text-gray-500">{test.date}</p>
                </div>
                <span className="text-indigo-600 font-semibold">{test.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tests</h2>
          <div className="space-y-4">
            {[
              { name: 'Full Mock Test', subject: 'All Subjects', date: '2024-03-20' },
              { name: 'Chemistry Unit Test', subject: 'Organic Chemistry', date: '2024-03-22' },
              { name: 'Physics Quiz', subject: 'Mechanics', date: '2024-03-25' },
            ].map((test, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">{test.name}</p>
                  <p className="text-sm text-gray-500">{test.subject}</p>
                </div>
                <span className="text-sm text-gray-500">{test.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}