import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Sparkles, Star, Zap } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const pricingPlans = [
  {
    name: 'Monthly Pro',
    priceId: 'YOUR_MONTHLY_PRICE_ID',
    price: '$5',
    frequency: '/month',
    description: 'Flexible monthly plan to unlock all premium features.',
    features: ['Unlimited Goals & Habits', 'Advanced Analytics', '1000 AI Credits/mo', 'Priority Support'],
    icon: Sparkles,
    color: 'blue',
    mode: 'subscription',
  },
  {
    name: 'Annual Plus',
    priceId: 'YOUR_ANNUAL_PRICE_ID',
    price: '$50',
    frequency: '/year',
    description: 'Best value! Get 2 months free with our annual plan.',
    features: ['All Pro features', 'Save 16% annually', '12000 AI Credits/yr', 'Dedicated Support'],
    icon: Zap,
    color: 'green',
    mode: 'subscription',
    popular: true,
  },
  {
    name: 'Lifetime Access',
    priceId: 'YOUR_LIFETIME_PRICE_ID',
    price: '$150',
    frequency: 'one-time',
    description: 'A single payment for lifetime access to all features, forever.',
    features: ['All Pro features', 'Lifetime Updates', 'Unlimited AI Credits', 'One-time Payment'],
    icon: Star,
    color: 'purple',
    mode: 'payment'
  }
];

const PricingTier = ({ plan, onCheckout }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500',
      button: 'bg-green-600 hover:bg-green-700',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-500',
      button: 'bg-purple-600 hover:bg-purple-700',
      text: 'text-purple-600'
    }
  };
  const selectedColor = colorClasses[plan.color];

  return (
    <div className={`relative p-6 rounded-lg border-2 flex flex-col ${plan.popular ? selectedColor.border : 'border-gray-200 dark:border-gray-700'} ${selectedColor.bg}`}>
      {plan.popular && (
        <div className={`absolute top-0 -translate-y-1/2 px-3 py-1 text-sm font-semibold text-white ${plan.color === 'green' ? 'bg-green-600' : 'bg-blue-600'} rounded-full shadow-md`}>
          Most Popular
        </div>
      )}
      <div className="flex-grow">
        <plan.icon className={`h-8 w-8 mb-4 ${selectedColor.text}`} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 h-12">{plan.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
          <span className="text-gray-600 dark:text-gray-400"> {plan.frequency}</span>
        </div>
        <ul className="mt-6 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-200">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={() => onCheckout(plan.priceId, plan.mode)} className={`w-full mt-8 ${selectedColor.button}`}>
        Choose Plan
      </Button>
    </div>
  );
};

const PricingModal = ({ isOpen, setIsOpen }) => {
  const { toast } = useToast();

  const handleCheckout = async (priceId, mode) => {
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || priceId.startsWith('YOUR_')) {
      toast({
        title: 'Stripe Not Configured',
        description: "Please provide Stripe keys in your environment to enable checkout.",
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          mode,
          successUrl: `${window.location.origin}/payment-status?status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment-status?status=cancelled`,
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">Upgrade Your Plan</DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that's right for you and unlock powerful new features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {pricingPlans.map(plan => (
            <PricingTier key={plan.name} plan={plan} onCheckout={handleCheckout} />
          ))}
        </div>
        <p className="text-xs text-center text-gray-500 mt-4">
          Payments are securely processed by Stripe. You can manage your subscription anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;