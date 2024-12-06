import React from 'react';
import { Brain, Target, BarChart, Clock, Users, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Get detailed insights into your performance and personalized improvement suggestions"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Custom Test Creation",
      description: "Create topic-wise tests tailored to your preparation needs"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Track your progress with detailed analytics and performance metrics"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Management",
      description: "Learn to manage time effectively with our smart timer features"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Peer Comparison",
      description: "Compare your performance with peers and top performers"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Feedback",
      description: "Receive immediate feedback on your answers and approach"
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PrepareAI?</h2>
          <p className="text-lg text-gray-600">Revolutionize your exam preparation with our cutting-edge features</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}