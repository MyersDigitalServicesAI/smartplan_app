import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { BrainCircuit, Sparkles, Wand2, Bot, CheckSquare, Loader2, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIPlannerPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  const fetchCredits = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('ai_credits_remaining')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching AI credits:", error);
      setCredits(0);
      toast({
        title: "Account Sync Error",
        description: "Could not verify your AI credits. Please refresh the page.",
        variant: "destructive",
      });
    } else if (data) {
      setCredits(data.ai_credits_remaining);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user, toast]);

  const handleGenerateSteps = async () => {
    setIsKeyMissing(false);
    if (credits !== null && credits <= 0) {
      toast({
        title: 'Out of AI Credits',
        description: 'Please upgrade to a premium plan for unlimited AI features.',
        variant: 'destructive',
      });
      return;
    }

    if (!goal.trim()) {
      toast({
        title: 'Goal is empty',
        description: 'Please enter a goal to get started.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSteps([]);

    try {
      const { data, error } = await supabase.functions.invoke('openai-assistant', {
        body: { goal, type: 'plan' },
      });

      if (error) {
        const errorData = await error.context.json();
        throw errorData;
      }

      if (data.error) {
        throw data;
      }
      
      if (data && data.steps && Array.isArray(data.steps)) {
        setSteps(data.steps);
        fetchCredits(); // Refresh credits after successful use
        toast({
          title: 'Plan Generated!',
          description: 'Your new action plan is ready below.',
        });
      } else {
        throw new Error('Received an unexpected format from the AI assistant.');
      }
      
    } catch (error) {
      let errorMessage = 'Could not generate steps. Please try again later.';
      let errorTitle = 'AI Assistant Error';

      switch (error.error) {
        case 'missing_api_key':
          errorTitle = 'OpenAI API Key Missing';
          errorMessage = 'The OpenAI API key has not been configured by the site owner.';
          setIsKeyMissing(true);
          break;
        case 'insufficient_quota':
          errorTitle = 'OpenAI Quota Exceeded';
          errorMessage = "The site's OpenAI account has run out of credits. Please notify the administrator.";
          break;
        case 'invalid_api_key':
          errorTitle = 'Invalid OpenAI API Key';
          errorMessage = 'The API key is incorrect or revoked. Please notify the administrator.';
          setIsKeyMissing(true);
          break;
        case 'no_credits_remaining':
          errorTitle = 'Out of AI Credits';
          errorMessage = 'You have used all your free credits. Please upgrade to a premium plan for unlimited AI features.';
          break;
        default:
          errorMessage = error.details || error.message || 'An unknown error occurred.';
          break;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
        duration: 9000,
      });
    } finally {
      setLoading(false);
    }
  };

  const canGenerate = credits === null || credits > 0;

  return (
    <>
      <Helmet>
        <title>AI Goal Planner - SmartPlan</title>
        <meta name="description" content="Use the power of AI to break down your big goals into small, actionable steps with SmartPlan." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center">
          <BrainCircuit className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            AI Goal Planner
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Turn your ambitious goals into a clear, step-by-step action plan.
          </p>
          {credits !== null && (
            <div className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-200">
              <Coins className="mr-2 h-4 w-4" />
              {credits} AI Credits Remaining
            </div>
          )}
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span>Tell me your goal</span>
            </CardTitle>
            <CardDescription>
              Describe what you want to achieve, and I'll create a plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isKeyMissing ? (
               <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                 <p className="font-semibold text-red-800 dark:text-red-200">AI Service Not Configured</p>
                 <p className="text-sm text-red-700 dark:text-red-300 mb-4">Please set your OpenAI API key in the settings to enable this feature.</p>
                 <Link to="/settings" state={{ tab: 'ai' }}>
                    <Button variant="destructive">Go to AI Settings</Button>
                 </Link>
               </div>
            ) : (
            <>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  type="text"
                  placeholder="e.g., Run a 5k marathon in 3 months"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateSteps()}
                  disabled={loading || !canGenerate}
                  className="flex-grow"
                />
                <Button onClick={handleGenerateSteps} disabled={loading || !canGenerate} className="w-full sm:w-auto">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Create Plan
                    </>
                  )}
                </Button>
              </div>
              {!canGenerate && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">You're out of credits. Upgrade to generate more plans.</p>
              )}
            </>
            )}
          </CardContent>
        </Card>

        {loading && !steps.length && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">The AI is thinking...</h3>
            <p className="text-gray-600 dark:text-gray-300">Crafting your personalized action plan.</p>
          </div>
        )}
        
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Your Action Plan</CardTitle>
                <CardDescription>Follow these steps to achieve your goal: "{goal}"</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <CheckSquare className="h-6 w-6 text-green-500 mt-1" />
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{step}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default AIPlannerPage;