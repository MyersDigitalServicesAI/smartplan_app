import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'success') {
      toast({
        title: 'Payment Successful!',
        description: "Welcome to premium! Your new features are now unlocked.",
        className: 'bg-green-500 text-white',
      });
    }
  }, [status, toast]);

  const isSuccess = status === 'success';

  return (
    <>
      <Helmet>
        <title>{isSuccess ? 'Payment Successful' : 'Payment Canceled'} - SmartPlan</title>
        <meta name="description" content="Stripe payment status page for SmartPlan." />
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
              {isSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
              )}
              <CardTitle className="text-2xl">
                {isSuccess ? 'Payment Successful!' : 'Payment Canceled'}
              </CardTitle>
              <CardDescription>
                {isSuccess
                  ? "Thank you for your purchase! Your plan has been upgraded."
                  : "Your payment was canceled. You have not been charged."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {isSuccess
                  ? "You can now access all premium features. Let's get back to planning!"
                  : "You can return to your dashboard or try the upgrade process again from the settings page."}
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentStatusPage;