import React from 'react';
import { motion } from 'framer-motion';
import GoalCard from './GoalCard';

const GoalList = ({ goals, onEdit, onDelete, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
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

export default GoalList;