import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import GoalStats from '@/components/goals/GoalStats';
import GoalForm from '@/components/goals/GoalForm';
import GoalList from '@/components/goals/GoalList';
import { Target, Plus, Loader2 } from 'lucide-react';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    priority: 'medium'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({ title: 'Error fetching goals', description: error.message, variant: 'destructive' });
      } else {
        setGoals(data);
      }
      setLoading(false);
    };
    fetchGoals();
  }, [user, toast]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Please enter a goal title', variant: 'destructive' });
      return;
    }

    const goalData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      target_date: formData.targetDate || null,
      priority: formData.priority,
    };

    if (editingGoal) {
      const { data, error } = await supabase
        .from('goals')
        .update({ ...goalData, updated_at: new Date().toISOString() })
        .eq('id', editingGoal.id)
        .select();

      if (error) {
        toast({ title: 'Error updating goal', description: error.message, variant: 'destructive' });
      } else {
        setGoals(goals.map(g => g.id === editingGoal.id ? data[0] : g));
        toast({ title: 'Goal updated!', description: 'Your goal has been successfully updated.' });
      }
    } else {
      const { data, error } = await supabase
        .from('goals')
        .insert({ ...goalData, user_id: user.id })
        .select();

      if (error) {
        toast({ title: 'Error creating goal', description: error.message, variant: 'destructive' });
      } else {
        setGoals([data[0], ...goals]);
        toast({ title: 'Goal created!', description: 'Your new goal has been added successfully.' });
      }
    }

    setIsDialogOpen(false);
    setEditingGoal(null);
    setFormData({ title: '', description: '', category: '', targetDate: '', priority: 'medium' });
  };

  const handleToggleCompletion = async (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const completed = !goal.completed;
    const { data, error } = await supabase
      .from('goals')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', goalId)
      .select();

    if (error) {
      toast({ title: 'Error updating goal', description: error.message, variant: 'destructive' });
    } else {
      setGoals(goals.map(g => g.id === goalId ? data[0] : g));
      toast({
        title: completed ? 'Goal completed!' : 'Goal reopened',
        description: completed ? 'Congratulations on achieving your goal!' : 'Goal marked as in progress',
      });
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const { error } = await supabase.from('goals').delete().eq('id', goalId);
    if (error) {
      toast({ title: 'Error deleting goal', description: error.message, variant: 'destructive' });
    } else {
      setGoals(goals.filter(g => g.id !== goalId));
      toast({ title: 'Goal deleted', description: 'Your goal has been removed successfully.' });
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    const formattedDate = goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : '';
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category || '',
      targetDate: formattedDate,
      priority: goal.priority || 'medium'
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setEditingGoal(null);
    setFormData({ title: '', description: '', category: '', targetDate: '', priority: 'medium' });
    setIsDialogOpen(true);
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>Goals - SmartPlan</title>
        <meta name="description" content="Track and manage your personal and professional goals with SmartPlan's intelligent goal tracking system." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Goals</h1>
            <p className="text-gray-600 dark:text-gray-300">Track and achieve your personal and professional objectives</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <GoalForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleFormSubmit}
              editingGoal={editingGoal}
            />
          </Dialog>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>
        ) : (
          <>
            <GoalStats goals={goals} />

            {totalGoals > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Card className="card-hover"><CardHeader><CardTitle>Overall Progress</CardTitle><CardDescription>Your goal completion progress</CardDescription></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between text-sm"><span>Completed: {completedGoals}</span><span>Remaining: {totalGoals - completedGoals}</span></div><Progress value={completionRate} className="h-3" /><p className="text-sm text-gray-600 dark:text-gray-400">{completionRate.toFixed(1)}% of your goals completed</p></div></CardContent></Card>
              </motion.div>
            )}

            {goals.length === 0 ? (
              <Card className="card-hover"><CardContent className="p-12 text-center"><Target className="h-16 w-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No goals yet</h3><p className="text-gray-600 dark:text-gray-300 mb-6">Start by creating your first goal to track your progress and achievements</p><Button onClick={handleOpenDialog} className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-2" />Create Your First Goal</Button></CardContent></Card>
            ) : (
              <GoalList goals={goals} onEdit={handleEditGoal} onDelete={handleDeleteGoal} onToggle={handleToggleCompletion} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Goals;