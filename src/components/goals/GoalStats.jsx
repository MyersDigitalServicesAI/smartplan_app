import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle, TrendingUp } from 'lucide-react';

const GoalStats = ({ goals }) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const stats = [
    {
      label: 'Total Goals',
      value: totalGoals,
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: completedGoals,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Success Rate',
      value: `${completionRate.toFixed(0)}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
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

export default GoalStats;