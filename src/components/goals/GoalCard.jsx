import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, Clock, Target, CheckCircle } from 'lucide-react';

const GoalCard = ({ goal, index, onEdit, onDelete, onToggle }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      key={goal.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className={`card-hover ${goal.completed ? 'bg-green-50/70 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={`text-lg ${goal.completed ? 'line-through text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {goal.title}
              </CardTitle>
              {goal.description && (
                <CardDescription className="mt-1">
                  {goal.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(goal)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(goal.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {goal.category && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                  {goal.category}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(goal.priority)}`}>
                {goal.priority} priority
              </span>
            </div>
            
            {goal.target_date && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                Created {new Date(goal.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <Button
              onClick={() => onToggle(goal.id)}
              className={`w-full ${
                goal.completed
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {goal.completed ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard;