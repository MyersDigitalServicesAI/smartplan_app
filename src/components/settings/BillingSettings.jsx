import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BillingSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-customer-portal');

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      window.location.href = data.url;

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access the customer portal. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
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
            <CreditCard className="h-5 w-5 text-green-500" />
            <span>Billing & Subscription</span>
          </CardTitle>
          <CardDescription>Manage your subscription and payment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You are currently on the Free plan. Upgrade to unlock premium features.
            </p>
            <Button onClick={handleManageSubscription} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Manage Subscription'
              )}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You will be redirected to our secure payment partner, Stripe.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BillingSettings;