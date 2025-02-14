import React from 'react';
import { Check, Building2, User, Phone } from 'lucide-react';

export function Pricing() {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Individual Plan */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-50 mx-auto">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-center text-2xl font-bold text-gray-900">Individual Student</h3>
              <p className="mt-2 text-center text-gray-600">Perfect for self-paced learning</p>
              <div className="mt-8 flex justify-center items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">₹199</span>
                <span className="ml-1 text-xl text-gray-500">/month</span>
              </div>
              <ul className="mt-8 space-y-4">
                {[
                  'Unlimited practice tests',
                  'AI-powered feedback',
                  'Performance analytics',
                  'Study plan creation',
                  'Mobile app access(Coming soon)',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button className="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 hover:bg-indigo-700 transition-colors">
                  Start 1-Week Free Trial
                </button>
                <p className="mt-2 text-sm text-center text-gray-500">No credit card required</p>
              </div>
            </div>
          </div>

          {/* School Plan */}
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 mx-auto">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-center text-2xl font-bold text-gray-900">Schools & Institutions</h3>
              <p className="mt-2 text-center text-gray-600">Custom solutions for your institution</p>
              <div className="mt-8 text-center">
                <span className="text-2xl font-bold text-gray-900">Custom Pricing</span>
                <p className="mt-2 text-gray-600">Tailored to your needs</p>
              </div>
              <ul className="mt-8 space-y-4">
                {[
                  'Bulk student accounts',
                  'Administrative dashboard',
                  'Progress monitoring',
                  'Custom test creation',
                  'Priority support',
                  'Teacher training',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button className="w-full flex items-center justify-center bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg px-4 py-3 hover:bg-indigo-50 transition-colors"
                onClick={() => {
                  const email = "sales@example.com"; // Replace with the actual email
                  const subject = encodeURIComponent("Schedule a meeting");
                  const body = encodeURIComponent("I want to contact you regarding this test series");
                  
                  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                }}>
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Sales Team
                </button>
                <p className="mt-2 text-sm text-center text-gray-500">Get a custom quote</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include 24/7 support and regular content updates.
            <br />
            Need help choosing? <button className="text-indigo-600 font-medium hover:text-indigo-700">Talk to our team</button>
          </p>
        </div>
      </div>
    </section>
  );
}