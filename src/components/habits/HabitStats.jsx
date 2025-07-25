import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, Flame } from 'lucide-react';

const HabitStats = ({ habits }) => {
  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const today = new Date().toDateString();
    const completedToday = habits.filter(habit => 
      habit.completedDates?.includes(today)
    ).length;
    return (completedToday / habits.length) * 100;
  };

  const getTotalStreak = () => {
    return habits.reduce((total, habit) => total + (habit.streak || 0), 0);
  };

  const stats = [
    {
      label: 'Active Habits',
      value: habits.length,
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      label: 'Today\'s Progress',
      value: `${getCompletionRate().toFixed(0)}%`,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Total Streak Days',
      value: getTotalStreak(),
      icon: Flame,
      color: 'text-orange-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <Card key={index} className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};

export default HabitStats;