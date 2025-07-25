import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - SmartPlan</title>
        <meta name="description" content="Terms of Service for SmartPlan." />
      </Helmet>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <p>This is a placeholder for your Terms of Service. Terms of service (also known as terms of use and terms and conditions, commonly abbreviated as ToS or T&C) are the legal agreements between a service provider and a person who wants to use that service.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Description of Service</h2>
            <p>Our service provides users with an AI-powered digital planner. You agree that the service may include certain communications from us, such as service announcements and administrative messages, and that these communications are considered part of the service and you will not be able to opt out of receiving them.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. User Conduct</h2>
            <p>You are responsible for all activity that occurs under your account. You agree not to use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
            
            <p className="mt-8">This is a template and should be replaced with your own legally compliant Terms of Service.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;