import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CreditCard, Brain, Sparkles, CheckCircle, Power } from 'lucide-react';

const IntegrationSettings = ({ toast }) => {

  const handleSupabaseDisconnect = () => {
    toast({
      title: '🚧 Disconnect Supabase',
      description: "To disconnect your Supabase project, please make another request.",
    });
  };

  const handleStripeSetup = () => {
    toast({
      title: '🚧 Stripe Integration',
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleOpenAICheck = () => {
    toast({
      title: '🚧 OpenAI Integration',
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span>Integrations</span>
          </CardTitle>
          <CardDescription>Connect external services to enhance your SmartPlan experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Database className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-200">Supabase Database</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">Secure cloud storage for your data</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Connected</span>
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300 mb-3">
                Your app is connected to the Supabase project "smartplan".
              </p>
              <Button onClick={handleSupabaseDisconnect} variant="destructive_outline">
                <Power className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200">Stripe Payments</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-400">Accept payments for premium features</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">Not Configured</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Set up Stripe to manage premium subscriptions.
              </p>
              <Button onClick={handleStripeSetup} variant="outline">
                Setup Stripe
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200">OpenAI API</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-400">AI-powered suggestions and insights</p>
                  </div>
                </div>
                 <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">Not Configured</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Connect your OpenAI key to enable AI features.
              </p>
              <div className="flex items-center space-x-2">
                <Button onClick={handleOpenAICheck} variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntegrationSettings;