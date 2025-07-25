import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setSubmitted(true);
      toast({
        title: 'Check your email',
        description: 'A password reset link has been sent to your email address.',
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - SmartPlan</title>
        <meta name="description" content="Reset your SmartPlan password." />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Forgot Your Password?</CardTitle>
              <CardDescription>
                {submitted
                  ? "We've sent a recovery link to your email."
                  : "No worries! Enter your email and we'll send you a reset link."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-md">
                  <p className="font-medium text-green-700 dark:text-green-300">Email sent successfully!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Please check your inbox (and spam folder) for instructions to reset your password.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/login" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;