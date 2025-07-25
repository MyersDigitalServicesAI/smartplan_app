import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Star, Users, Loader2, Gift, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      priceIdMonthly: null,
      priceIdYearly: null,
      priceMonthly: '$0',
      priceYearly: '$0',
      description: 'Perfect for getting started and trying out the core features.',
      features: ['10 AI Suggestions / week', 'Basic Goal Tracking', 'Habit Formation', 'Community Support'],
      icon: <Gift className="h-6 w-6" />,
      actionText: 'Get Started for Free',
      tierId: 'free',
    },
    {
      name: 'Starter',
      priceIdMonthly: 'price_1RheTy07Szqf7XQyeDmSp6UO',
      priceIdYearly: 'price_1RheV907Szqf7XQykgVQDveB',
      priceMonthly: '$5',
      priceYearly: '$49',
      description: 'Ideal for light users who want more consistent AI assistance.',
      features: ['100 AI Suggestions / month', 'Full Calendar Sync', 'Advanced Goal Analytics', 'Email Support'],
      icon: <Zap className="h-6 w-6" />,
      isPopular: true,
      tierId: 'starter',
    },
    {
      name: 'Pro',
      priceIdMonthly: 'price_1RhecZ07Szqf7XQyXc9djdyL',
      priceIdYearly: 'price_1Rhef407Szqf7XQyf8gg3m3L',
      priceMonthly: '$15',
      priceYearly: '$150',
      description: 'For power users who want unlimited potential and advanced insights.',
      features: ['Unlimited AI Suggestions', 'AI Auto-Scheduling', 'Habit Analytics', 'Priority Support'],
      icon: <Star className="h-6 w-6" />,
      tierId: 'pro',
    },
  ];

  const handleChoosePlan = async (plan) => {
    if (plan.tierId === 'free') {
      navigate('/register');
      return;
    }
    
    if (plan.tierId === 'team') {
      toast({
        title: 'Contact Sales',
        description: "Please get in touch with us to discuss your team's needs.",
      });
      return;
    }
    
    const priceId = isYearly ? plan.priceIdYearly : plan.priceIdMonthly;
    setLoadingPlan(plan.name);

    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || !priceId || priceId.startsWith('YOUR_')) {
      toast({
        title: 'Stripe Not Configured',
        description: "Please provide Stripe keys and Price IDs to enable checkout.",
        variant: 'destructive',
      });
      setLoadingPlan(null);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          mode: 'subscription',
          successUrl: `${window.location.origin}/payment-status?status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      const { sessionId } = data;
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        toast({
          title: 'Stripe Error',
          description: stripeError.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not initiate checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setLoadingPlan(null);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <>
      <Helmet>
        <title>Pricing Tiers - SmartPlan</title>
        <meta name="description" content="Explore SmartPlan pricing tiers and choose the best plan for your needs." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Choose Your Plan
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find the perfect plan to boost your productivity, starting for free.
            </p>
            <div className="flex items-center justify-center mt-8 space-x-4">
              <Label htmlFor="billing-cycle" className="text-gray-600 dark:text-gray-300">Monthly</Label>
              <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
              <Label htmlFor="billing-cycle" className="text-gray-600 dark:text-gray-300">
                Yearly <span className="text-green-500 font-semibold">(Save up to 18%!)</span>
              </Label>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-10">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card
                  className={cn(
                    'flex flex-col rounded-lg shadow-lg overflow-hidden h-full',
                    plan.isPopular ? 'border-2 border-blue-500' : 'border dark:border-gray-700'
                  )}
                >
                  {plan.isPopular && (
                    <div className="bg-blue-500 text-white text-center py-1 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "p-3 rounded-full",
                         plan.tierId === 'free' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300' : 
                         plan.tierId === 'starter' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300' : 
                         'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                      )}>
                        {plan.icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                      </div>
                    </div>
                     <div className="mt-4 flex items-baseline text-5xl font-extrabold text-gray-900 dark:text-white">
                      {(isYearly && plan.priceYearly) ? plan.priceYearly : plan.priceMonthly}
                      <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
                         {plan.tierId !== 'free' && ((isYearly && plan.priceYearly !== '$0') ? '/year' : '/month')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-6 bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-gray-600 dark:text-gray-300 mb-6 h-12">{plan.description}</p>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="ml-3 text-base text-gray-700 dark:text-gray-200">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6 bg-white dark:bg-gray-800">
                    <Button
                      onClick={() => handleChoosePlan(plan)}
                      disabled={loadingPlan === plan.name}
                      className={cn(
                        'w-full text-lg',
                        plan.isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300'
                      )}
                    >
                      {loadingPlan === plan.name ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      ) : (
                        plan.actionText || 'Choose Plan'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;