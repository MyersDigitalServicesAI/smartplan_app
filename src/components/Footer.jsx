import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">SmartPlan</span>
            </div>
            <p className="text-gray-400">
              An AI-powered personal planner that turns goals into daily schedules.
            </p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-200">Product</p>
            <ul className="mt-4 space-y-2">
              <li><Link to="/#features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link to="/#pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link to="/#testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-200">Legal</p>
            <ul className="mt-4 space-y-2">
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-200">Feedback</p>
            <div className="mt-4">
              <FeedbackForm />
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} SmartPlan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;