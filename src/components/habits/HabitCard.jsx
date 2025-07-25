import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import WeeklyProgress from './WeeklyProgress';
import { Edit, Trash2, Clock, Flame } from 'lucide-react';

const HabitCard = ({ habit, index, onEdit, onDelete, onToggle }) => {
  const isCompletedToday = () => {
    const today = new Date().toDateString();
    return habit.completed_dates?.includes(today) || false;
  };

  return (
    <motion.div
      key={habit.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className={`card-hover ${isCompletedToday() ? 'bg-green-50/70 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center space-x-2">
                <span>{habit.name}</span>
                {habit.streak > 0 && (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-medium">{habit.streak}</span>
                  </div>
                )}
              </CardTitle>
              {habit.description && (
                <CardDescription className="mt-1">
                  {habit.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(habit)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(habit.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {habit.category && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900/50 dark:text-purple-300">
                  {habit.category}
                </span>
              )}
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {habit.frequency}
              </span>
            </div>
            
            <WeeklyProgress habit={habit} />
            
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                Created {new Date(habit.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-md bg-gray-50 dark:bg-gray-900/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => onToggle(habit.id)}>
              <Checkbox
                checked={isCompletedToday()}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <span className={`text-sm ${isCompletedToday() ? 'text-green-700 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                {isCompletedToday() ? 'Completed today!' : 'Mark as done today'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HabitCard;