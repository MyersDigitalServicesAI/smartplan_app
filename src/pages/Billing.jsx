import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, CreditCard, Sparkles, ShieldCheck, FileText } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const Billing = () => {
        const { profile } = useAuth();
        const [loadingPortal, setLoadingPortal] = useState(false);
        const { toast } = useToast();
        const navigate = useNavigate();

        const planDetails = {
          free: { name: 'Free Plan', description: 'Basic features with AI credit limits.' },
          starter: { name: 'Starter Plan', description: 'More AI credits and advanced features.' },
          pro: { name: 'Pro Plan', description: 'Unlimited power for ultimate productivity.' },
        };

        const currentPlan = planDetails[profile?.plan_id] || planDetails['free'];

        const handleManageSubscription = async () => {
            setLoadingPortal(true);
            try {
              const { data, error } = await supabase.functions.invoke('stripe-customer-portal', {
                body: { returnUrl: window.location.href }
              });
        
              if (error) throw new Error(`Function Error: ${error.message}`);
              if (data.error) throw new Error(`Portal Error: ${data.error}`);
              
              window.location.href = data.url;
        
            } catch (error) {
              toast({
                title: 'Error Accessing Portal',
                description: 'We couldn’t open the customer portal. If you don’t have a subscription, please choose a plan first.',
                variant: 'destructive',
              });
            } finally {
              setLoadingPortal(false);
            }
        };

        return (
            <>
                <Helmet>
                    <title>Billing - SmartPlan</title>
                    <meta name="description" content="Manage your SmartPlan subscription, view invoices, and upgrade your plan." />
                </Helmet>

                <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your subscription, view invoices, and explore plans.</p>
                  </motion.div>
                  
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-b">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <ShieldCheck className="h-6 w-6 text-blue-600"/>
                          <span>Current Plan</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 grid sm:grid-cols-2 gap-4 items-center">
                        <div>
                          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{currentPlan.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{currentPlan.description}</p>
                        </div>
                        <div className="flex sm:justify-end">
                         {profile?.plan_id === 'free' ? (
                            <Button onClick={() => navigate('/pricing')}>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Upgrade Plan
                            </Button>
                          ) : (
                            <Button onClick={() => navigate('/pricing')}>
                              View Plans
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className="overflow-hidden">
                        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-b">
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <FileText className="h-6 w-6 text-green-600"/>
                            <span>Payment Management</span>
                          </CardTitle>
                          <CardDescription className="pt-2">
                              Access the Stripe customer portal to update your payment method, view your billing history, download invoices, or cancel your subscription.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            <Button onClick={handleManageSubscription} disabled={loadingPortal}>
                                {loadingPortal ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Redirecting...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Open Customer Portal
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">You will be securely redirected to Stripe.</p>
                        </CardContent>
                    </Card>
                  </motion.div>
                </div>
            </>
        );
    };

    export default Billing;