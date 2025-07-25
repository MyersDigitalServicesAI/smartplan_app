import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

const ConfirmationPage = () => {
  return (
    <>
      <Helmet>
        <title>Check Your Email - SmartPlan</title>
        <meta name="description" content="Please check your email to confirm your SmartPlan account." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md">
            <CardHeader className="items-center text-center">
              <MailCheck className="h-16 w-16 text-green-500 mb-4" />
              <CardTitle className="text-2xl">Check Your Inbox!</CardTitle>
              <CardDescription>
                We've sent a confirmation link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please click the link in the email to activate your account. If you don't see it, please check your spam folder.
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ConfirmationPage;