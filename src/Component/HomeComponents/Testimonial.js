import React from 'react';
import { Star } from 'lucide-react';

export function Testimonial() {
  const testimonials = [
    {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      text: "PrepareAI helped me crack IIT-JEE with a great rank. The AI feedback was incredibly helpful in improving my weak areas.",
      achievement: "AIR 245 in IIT-JEE"
    },
    {
      name: "Rahul Verma",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      text: "The personalized test series helped me stay focused and track my progress effectively. Highly recommended!",
      achievement: "NEET Top 100"
    },
    {
      name: "Anjali Patel",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      text: "The instant AI feedback and performance analytics gave me a clear roadmap for improvement.",
      achievement: "AIR 567 in IIT-JEE"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">See how PrepareAI has helped students achieve their dreams</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div className="text-indigo-600 font-semibold">{testimonial.achievement}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}