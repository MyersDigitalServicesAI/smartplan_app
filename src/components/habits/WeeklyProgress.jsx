import React from 'react';

const WeeklyProgress = ({ habit }) => {
  const getWeeklyProgress = (habit) => {
    const today = new Date();
    const weekDates = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weekDates.push(date.toDateString());
    }
    
    return weekDates.map(date => ({
      date,
      completed: habit.completed_dates?.includes(date) || false
    }));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week</p>
      <div className="flex justify-between">
        {getWeeklyProgress(habit).map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              day.completed
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={new Date(day.date).toLocaleDateString()}
          >
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;