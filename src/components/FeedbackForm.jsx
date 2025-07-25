import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const FeedbackForm = () => {
  const { toast } = useToast();
  const formspreeUrl = "https://formspree.io/f/YOUR_UNIQUE_ID";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formspreeUrl.includes("YOUR_UNIQUE_ID")) {
      toast({
        title: "🚧 Form Not Configured",
        description: "Please replace 'YOUR_UNIQUE_ID' in FeedbackForm.jsx with your Formspree URL.",
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
          title: "💌 Feedback Sent!",
          description: "Thank you for helping us improve SmartPlan.",
        });
        form.reset();
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Could not submit your feedback. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <form 
      action={formspreeUrl}
      method="POST" 
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2 text-left">
        <Label htmlFor="email-feedback" className="text-gray-400">Your Email</Label>
        <Input
          id="email-feedback"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          required
          className="bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500"
        />
      </div>
      <div className="space-y-2 text-left">
        <Label htmlFor="feedback-message" className="text-gray-400">Feedback</Label>
        <Textarea
          id="feedback-message"
          name="feedback"
          placeholder="Share your feedback or suggestions..."
          required
          className="bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500"
        />
      </div>
      <Button type="submit" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Submit Feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;