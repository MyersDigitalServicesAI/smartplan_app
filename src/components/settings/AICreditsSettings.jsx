import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AICreditsSettings = ({ toast }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      setLoading(true);
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
      setLoading(false);
    };
    fetchCredits();
  }, [user, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-orange-500" />
            <span>AI Credits</span>
          </CardTitle>
          <CardDescription>Manage your credits for AI-powered features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <p className="text-sm text-orange-800 dark:text-orange-200">You have</p>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-orange-600 my-1" />
              ) : (
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-300">{credits}</p>
              )}
              <p className="text-sm text-orange-800 dark:text-orange-200">credits remaining.</p>
            </div>
            <Button onClick={() => navigate('/billing')} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Get More Credits
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            One credit is used each time you generate an AI plan or get suggestions.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AICreditsSettings;