import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { KeyRound, Sparkles, Loader2, Save, ExternalLink } from 'lucide-react';

const APIKeySettings = ({ toast }) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKey.trim() || !apiKey.startsWith('sk-')) {
      toast({
        title: 'Invalid API Key Format',
        description: 'Please enter a valid OpenAI API key, which should start with "sk-".',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('set-openai-api-key', {
        body: { apiKey },
      });

      if (error) {
        // Handle structured errors from the edge function
        const errorBody = await error.context.json();
        throw new Error(errorBody.error || error.message);
      }
      
      if (data && data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'API Key Verified & Saved!',
        description: 'Your OpenAI API key has been successfully stored.',
      });
      setApiKey('');

    } catch (error) {
      toast({
        title: 'Error Saving API Key',
        description: error.message || 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
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
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>AI & Integrations</span>
          </CardTitle>
          <CardDescription>
            Connect your OpenAI account to power the AI features in SmartPlan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveApiKey} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="openai-api-key" className="flex items-center">
                <KeyRound className="h-4 w-4 mr-2" />
                OpenAI API Key
              </Label>
              <Input
                id="openai-api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored securely and is never exposed to the client.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying & Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save API Key
                  </>
                )}
              </Button>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link" type="button" className="text-blue-600">
                  Get your API key
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default APIKeySettings;