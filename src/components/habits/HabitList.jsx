import React from 'react';
import { motion } from 'framer-motion';
import HabitCard from './HabitCard';

const HabitList = ({ habits, onEdit, onDelete, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {habits.map((habit, index) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default HabitList;