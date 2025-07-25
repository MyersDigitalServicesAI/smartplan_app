import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EmailSignupForm = () => {
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
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        toast({
          title: "🎉 Thank you for signing up!",
          description: "Keep an eye on your inbox for updates.",
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <form 
        action={formspreeUrl}
        method="POST" 
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
      >
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email-signup"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="pl-10"
            required
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Get First Month Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};

export default EmailSignupForm;