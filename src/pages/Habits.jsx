import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import HabitStats from '@/components/habits/HabitStats';
import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';
import { Calendar, Plus, TrendingUp, Target, Loader2 } from 'lucide-react';

const Habits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', frequency: 'daily' });
  const { toast } = useToast();

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Error fetching habits', description: error.message, variant: 'destructive' });
      } else {
        setHabits(data);
      }
      setLoading(false);
    };
    fetchHabits();
  }, [user, toast]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter a habit name', variant: 'destructive' });
      return;
    }

    if (editingHabit) {
      const { data, error } = await supabase
        .from('habits')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingHabit.id)
        .select();

      if (error) {
        toast({ title: 'Error updating habit', description: error.message, variant: 'destructive' });
      } else {
        setHabits(habits.map(h => h.id === editingHabit.id ? data[0] : h));
        toast({ title: 'Habit updated!', description: 'Your habit has been successfully updated.' });
      }
    } else {
      const { data, error } = await supabase
        .from('habits')
        .insert({ ...formData, user_id: user.id, streak: 0, completed_dates: [] })
        .select();

      if (error) {
        toast({ title: 'Error creating habit', description: error.message, variant: 'destructive' });
      } else {
        setHabits([data[0], ...habits]);
        toast({ title: 'Habit created!', description: 'Your new habit has been added successfully.' });
      }
    }

    setIsDialogOpen(false);
    setEditingHabit(null);
    setFormData({ name: '', description: '', category: '', frequency: 'daily' });
  };

  const handleToggleCompletion = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toDateString();
    const completedDates = habit.completed_dates || [];
    const isCompletedToday = completedDates.includes(today);
    
    let newCompletedDates;
    let newStreak = habit.streak || 0;
    
    if (isCompletedToday) {
      newCompletedDates = completedDates.filter(date => date !== today);
      newStreak = Math.max(0, newStreak - 1);
    } else {
      newCompletedDates = [...completedDates, today];
      newStreak += 1;
    }
    
    const { data, error } = await supabase
      .from('habits')
      .update({ completed_dates: newCompletedDates, streak: newStreak, updated_at: new Date().toISOString() })
      .eq('id', habitId)
      .select();

    if (error) {
      toast({ title: 'Error updating habit', description: error.message, variant: 'destructive' });
    } else {
      setHabits(habits.map(h => h.id === habitId ? data[0] : h));
      if (!isCompletedToday) {
        toast({ title: 'Great job!', description: `Habit completed! Your streak is now ${newStreak} days.` });
      }
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    if (error) {
      toast({ title: 'Error deleting habit', description: error.message, variant: 'destructive' });
    } else {
      setHabits(habits.filter(h => h.id !== habitId));
      toast({ title: 'Habit deleted', description: 'Your habit has been removed successfully.' });
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description || '',
      category: habit.category || '',
      frequency: habit.frequency || 'daily'
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setEditingHabit(null);
    setFormData({ name: '', description: '', category: '', frequency: 'daily' });
    setIsDialogOpen(true);
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const today = new Date().toDateString();
    const completedToday = habits.filter(h => h.completed_dates?.includes(today)).length;
    return (completedToday / habits.length) * 100;
  };

  return (
    <>
      <Helmet>
        <title>Habits - SmartPlan</title>
        <meta name="description" content="Build and track daily habits with SmartPlan's intelligent habit tracking system. Monitor streaks and progress." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Habits</h1>
            <p className="text-gray-600 dark:text-gray-300">Build lasting habits and track your daily progress</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="bg-purple-600 hover:bg-purple-700 mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <HabitForm formData={formData} setFormData={setFormData} handleSubmit={handleFormSubmit} editingHabit={editingHabit} />
          </Dialog>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>
        ) : (
          <>
            <HabitStats habits={habits} />
            {habits.length === 0 ? (
              <Card className="card-hover"><CardContent className="p-12 text-center"><Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No habits yet</h3><p className="text-gray-600 dark:text-gray-300 mb-6">Start building positive habits by creating your first habit tracker</p><Button onClick={handleOpenDialog} className="bg-purple-600 hover:bg-purple-700"><Plus className="h-4 w-4 mr-2" />Create Your First Habit</Button></CardContent></Card>
            ) : (
              <HabitList habits={habits} onEdit={handleEditHabit} onDelete={handleDeleteHabit} onToggle={handleToggleCompletion} />
            )}
            {habits.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8">
                <Card className="card-hover bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0"><CardContent className="p-6"><div className="flex flex-col md:flex-row items-center justify-between"><div className="mb-4 md:mb-0"><h3 className="text-xl font-bold mb-2">Keep Going!</h3><p className="text-purple-100">You've completed {getCompletionRate().toFixed(0)}% of your habits today. {getCompletionRate() === 100 ? ' Amazing work! 🎉' : ' You\'re doing great!'}</p></div><div className="flex items-center space-x-4"><div className="text-center"><TrendingUp className="h-8 w-8 mx-auto mb-1" /><p className="text-sm">Progress</p></div><div className="text-center"><Target className="h-8 w-8 mx-auto mb-1" /><p className="text-sm">Consistency</p></div></div></div></CardContent></Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Habits;