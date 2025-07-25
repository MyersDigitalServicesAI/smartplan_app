import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Loader2, Target } from 'lucide-react';

const DashboardGoalForm = ({ onGoalAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast({
        title: 'Goal Name is required',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    const { data, error } = await supabase
      .from('goals')
      .insert({
        title,
        description,
        target_date: targetDate || null,
        user_id: user.id,
        completed: false,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({
        title: 'Error creating goal',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Goal created!',
        description: 'Your new goal has been added successfully.',
      });
      setTitle('');
      setDescription('');
      setTargetDate('');
      if (onGoalAdded) {
        onGoalAdded(data);
      }
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800/50 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Create a New Goal
        </CardTitle>
        <CardDescription>What do you want to achieve next?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Learn React for 30 days"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-description">Description (Optional)</Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Build a project to solidify my skills"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-target-date">Target Date (Optional)</Label>
            <Input
              id="goal-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Saving...' : 'Save Goal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardGoalForm;