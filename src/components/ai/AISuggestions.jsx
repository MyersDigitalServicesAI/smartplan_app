import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Sparkles, Lightbulb, Copy, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const AISuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState([]);
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

  const handleCopySuggestion = (suggestionText) => {
    navigator.clipboard.writeText(suggestionText);
    toast({
      title: 'Copied to clipboard!',
      description: `You can now paste this into your new goal.`,
    });
  };

  const handleGetSuggestions = async () => {
    setIsKeyMissing(false);
    if (credits !== null && credits <= 0) {
      toast({
        title: 'Out of AI Credits',
        description: 'Please upgrade to a premium plan for unlimited AI features.',
        variant: 'destructive',
      });
      return;
    }

    if (!context.trim()) {
      toast({
        title: 'Context is empty',
        description: 'Please enter a goal or interest.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('openai-assistant', {
        body: { context, type: 'suggestions' },
      });

      if (error) {
        const errorData = await error.context.json();
        throw errorData;
      }

      if (data.error) {
        throw data;
      }

      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        fetchCredits(); // Refresh credits after successful use
        toast({
          title: 'Suggestions Ready!',
          description: 'Here are some ideas for you.',
        });
      } else {
        throw new Error('Received an unexpected format from the AI assistant.');
      }
    } catch (error) {
      let errorMessage = 'Could not generate suggestions. Please try again later.';
      let errorTitle = 'AI Suggestions Error';

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
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-orange-500" />
              <span>Get AI Suggestions</span>
            </CardTitle>
            <CardDescription>
              Enter a goal or interest to get personalized suggestions.
            </CardDescription>
          </div>
          {credits !== null && (
            <div className="flex-shrink-0 rounded-full bg-orange-100 dark:bg-orange-900/50 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-200 flex items-center space-x-1">
              <Coins className="h-3 w-3" />
              <span>{credits} left</span>
            </div>
          )}
        </div>
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
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <Input
                type="text"
                placeholder="e.g., 'stress relief' or 'learn a new skill'"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGetSuggestions()}
                disabled={loading || !canGenerate}
                className="flex-grow"
              />
              <Button onClick={handleGetSuggestions} disabled={loading || !canGenerate} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </div>
            {!canGenerate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">You're out of credits. Upgrade to get more suggestions.</p>
            )}
          </>
        )}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 border-t pt-4"
          >
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Here are some ideas:</h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between space-x-2 text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-800 dark:text-gray-200">{suggestion}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    onClick={() => handleCopySuggestion(suggestion)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy suggestion</span>
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;