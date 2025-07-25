import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SmartPlan</title>
        <meta name="description" content="Privacy Policy for SmartPlan." />
      </Helmet>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <p>This is a placeholder for your Privacy Policy. A privacy policy is a statement or a legal document that discloses some or all of the ways a party gathers, uses, discloses, and manages a customer or client's data. It fulfills a legal requirement to protect a customer or client's privacy.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p>Our Service may collect information that can identify you ("Personal Data"). Personal Data may include, but is not limited to:</p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Usage Data</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us. This is a template and should be replaced with your own legally compliant Privacy Policy.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;