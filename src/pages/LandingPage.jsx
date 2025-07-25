import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import EmailSignupForm from '@/components/EmailSignupForm';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Check,
  Users,
  Gift,
  Star,
  Loader2
} from 'lucide-react';

const StickyHeader = () => {
  const { toast } = useToast();
  const formspreeUrl = "https://formspree.io/f/YOUR_UNIQUE_ID";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formspreeUrl.includes("YOUR_UNIQUE_ID")) {
      toast({
        title: "🚧 Form Not Configured",
        description: "Please replace 'YOUR_UNIQUE_ID' in EmailSignupForm.jsx with your Formspree URL.",
        variant: "destructive",
      });
      return;
    }
    const form = e.target;
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        toast({
          title: "🎉 Welcome to the waitlist!",
          description: "You'll get one month free at launch. Keep an eye on your inbox!",
        });
        form.reset();
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Could not submit the form. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        <p className="font-semibold text-center sm:text-left">
          <span className="font-bold">Join our early access</span> — get one month free!
        </p>
        <form 
          action={formspreeUrl}
          method="POST"
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="px-3 py-1.5 rounded-md text-gray-800 flex-grow sm:flex-grow-0"
          />
          <Button type="submit" variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-100">
            Claim Offer
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();

  const features = [
    {
      icon: Target,
      title: 'Smart Goal Tracking',
      description: 'Set and track personal goals with AI-powered insights and progress monitoring.'
    },
    {
      icon: Calendar,
      title: 'Habit Building',
      description: 'Build lasting habits with daily tracking and intelligent reminders.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your progress with beautiful charts and detailed analytics.'
    },
    {
      icon: Sparkles,
      title: 'AI Suggestions',
      description: 'Get personalized recommendations to optimize your planning and productivity.'
    }
  ];

  const testimonials = [
    {
      quote: "SmartPlan has revolutionized my productivity. The AI scheduling is a game-changer!",
      name: "Alex Johnson",
      title: "Freelance Developer"
    },
    {
      quote: "I finally feel in control of my goals. The habit tracker is simple yet so effective.",
      name: "Samantha Lee",
      title: "Marketing Manager"
    },
    {
      quote: "As a student, this is the tool I've been dreaming of. It keeps me organized and focused.",
      name: "David Chen",
      title: "University Student"
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      icon: Gift,
      priceMonthly: '$0',
      priceYearly: '$0',
      features: ['1 calendar sync', 'Manual task management', 'Basic AI prompts'],
      actionText: 'Get Started for Free',
      isPopular: false,
    },
    {
      name: 'Starter',
      icon: Sparkles,
      priceMonthly: '$5',
      priceYearly: '$49',
      features: ['3 AI plans/week', 'Full calendar sync', 'Habit tracking'],
      actionText: 'Choose Starter',
      isPopular: true,
    },
    {
      name: 'Pro',
      icon: Star,
      priceMonthly: '$15',
      priceYearly: '$120',
      features: ['Unlimited AI plans', 'Advanced analytics', 'Goal & habit modules'],
      actionText: 'Choose Pro',
      isPopular: false,
    }
  ];

  const handleChoosePlan = (plan) => {
    if (plan.name === 'Free') {
      navigate('/register');
    } else {
      toast({
        title: "🚧 Feature Coming Soon!",
        description: "Checkout will be enabled at launch. Sign up for early access to be notified!",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>SmartPlan - AI-Powered Personal Planner</title>
        <meta name="description" content="An AI-powered personal planner that turns goals into daily schedules—syncs with your calendar and adapts live." />
      </Helmet>
      
      <StickyHeader />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/50 pt-16">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-200 dark:border-gray-700 sticky top-[68px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">SmartPlan</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try SMARTPLAN Free
                </Button>
              </div>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">
                  Early Access Only — Launching Summer 2025
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  An AI-powered personal planner that turns goals into daily schedules
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                  —syncs with your calendar and adapts live.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    Start your AI-Powered Schedule
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="bg-white p-4 rounded-lg shadow-lg card-hover">
                  <img  class="w-full h-full object-cover rounded-md" alt="AI-generated daily plan on a mobile screen" src="https://images.unsplash.com/photo-1684089007697-9c8e04ed3be2" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg card-hover md:mt-8">
                  <img  class="w-full h-full object-cover rounded-md" alt="Calendar integration interface showing synced events" src="https://images.unsplash.com/photo-1649433391719-2e784576d044" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg card-hover">
                  <img  class="w-full h-full object-cover rounded-md" alt="Habit and goal tracking dashboard with progress charts" src="https://images.unsplash.com/photo-1569230919100-d3fd5e1132f4" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Powerful features designed to help you organize your life and achieve your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 rounded-lg bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700/50 transition-colors card-hover"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the plan that's right for you.
              </p>
              <div className="flex items-center justify-center mt-8 space-x-4">
                <Label htmlFor="billing-cycle-landing" className="text-gray-600 dark:text-gray-300">Monthly</Label>
                <Switch id="billing-cycle-landing" checked={isYearly} onCheckedChange={setIsYearly} />
                <Label htmlFor="billing-cycle-landing" className="text-gray-600 dark:text-gray-300">
                  Yearly <span className="text-green-500 font-semibold">(Save 20%!)</span>
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={cn(
                    'flex flex-col rounded-lg shadow-lg overflow-hidden h-full p-6 bg-white dark:bg-gray-800 card-hover',
                    plan.isPopular ? 'border-2 border-blue-500' : 'border dark:border-gray-700'
                  )}
                >
                  {plan.isPopular && (
                    <div className="bg-blue-500 text-white text-center py-1 text-sm font-semibold rounded-t-lg -m-6 mb-6">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-300">
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                    {isYearly ? plan.priceYearly : plan.priceMonthly}
                    <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
                      {plan.name !== 'Free' && (isYearly ? '/year' : '/month')}
                    </span>
                  </div>
                  <ul className="space-y-4 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-1" />
                        <p className="text-base text-gray-700 dark:text-gray-200">{feature}</p>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleChoosePlan(plan)}
                    className={cn(
                      'w-full text-lg mt-8',
                      plan.isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300'
                    )}
                  >
                    {plan.actionText}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Loved by Planners Everywhere
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our early users are saying.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md"
                >
                  <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6">"{testimonial.quote}"</p>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Plan Smarter?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join our early access list and get your first month of Pro on us.
            </p>
            <EmailSignupForm />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;