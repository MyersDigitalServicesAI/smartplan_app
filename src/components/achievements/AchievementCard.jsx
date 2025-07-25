import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AchievementCard = ({ achievement, isUnlocked }) => {
  const { name, description, icon } = achievement;
  const IconComponent = LucideIcons[icon] || LucideIcons.Award;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "h-full transition-all duration-300",
        isUnlocked ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" : "bg-gray-100 dark:bg-gray-800/50 opacity-60"
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <IconComponent className={cn(
            "h-6 w-6",
            isUnlocked ? "text-blue-500" : "text-gray-400 dark:text-gray-500"
          )} />
        </CardHeader>
        <CardContent>
          <p className={cn(
            "text-xs",
            isUnlocked ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
          )}>
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementCard;