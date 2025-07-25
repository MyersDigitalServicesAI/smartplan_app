import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import UpdatePasswordPage from '@/pages/UpdatePasswordPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Habits from '@/pages/Habits';
import Settings from '@/pages/Settings';
import AIPlannerPage from '@/pages/AIPlannerPage';
import PaymentStatusPage from '@/pages/PaymentStatusPage';
import PricingPage from '@/pages/PricingPage';
import Billing from '@/pages/Billing';
import ProtectedRoute from '@/components/ProtectedRoute';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Layout from '@/components/Layout';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>SmartPlan - AI-Powered Digital Planner</title>
        <meta name="description" content="An AI-powered personal planner that turns goals into daily schedules—syncs with your calendar and adapts live." />
        <meta name="openai-domain-verification" content="dv-dYyMJakxWoNfhc20vTmvSEGA" />
      </Helmet>
      <div className="min-h-screen text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/confirm-email" element={<ConfirmationPage />} />
          <Route path="/payment-status" element={<PaymentStatusPage />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="goals" element={<Goals />} />
            <Route path="habits" element={<Habits />} />
            <Route path="ai-planner" element={<AIPlannerPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="billing" element={<Billing />} />
          </Route>

        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;