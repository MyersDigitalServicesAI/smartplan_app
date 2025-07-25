import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Progress } from '@/components/ui/progress';
    import { useToast } from '@/components/ui/use-toast';
    import AISuggestions from '@/components/ai/AISuggestions';
    import { 
      Target, 
      CalendarCheck, 
      TrendingUp, 
      Sparkles,
      CheckCircle,
      Clock,
      Loader2,
      BarChart,
    } from 'lucide-react';

    const StatCard = ({ title, value, icon, color, delay }) => (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
        <Card className={`card-hover bg-gradient-to-br ${color} text-white border-0 overflow-hidden`}>
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold">{value}</p>
            </div>
            <div className="opacity-50">{icon}</div>
          </CardContent>
        </Card>
      </motion.div>
    );

    const ProgressCard = ({ title, description, value, completed, total, icon, delay }) => (
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
        <Card className="card-hover h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              {icon}
              <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={value} className="h-2" />
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span>{value.toFixed(0)}% complete</span>
                <span>{completed}/{total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );

    const Dashboard = () => {
      const { user, profile } = useAuth();
      const [goals, setGoals] = useState([]);
      const [habits, setHabits] = useState([]);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        const fetchData = async () => {
          if (!user) return;
          setLoading(true);

          const [goalsResponse, habitsResponse] = await Promise.all([
            supabase.from('goals').select('*').eq('user_id', user.id).limit(5).order('created_at', { ascending: false }),
            supabase.from('habits').select('*').eq('user_id', user.id).limit(5).order('created_at', { ascending: false })
          ]);

          if (goalsResponse.error) {
            toast({ title: "Error fetching goals", description: goalsResponse.error.message, variant: 'destructive' });
          } else {
            setGoals(goalsResponse.data);
          }

      if (habitsResponse.error) {
        toast({ title: "Error fetching habits", description: habitsResponse.error.message, variant: 'destructive' });
      } else {
        setHabits(habitsResponse.data);
      }

          setLoading(false);
        };
        fetchData();
      }, [user, toast]);
      
      const handleUpgrade = () => navigate('/billing');

      const completedGoals = goals.filter(goal => goal.completed).length;
      const totalGoals = goals.length;
      const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

      const todayHabits = habits.filter(habit => {
        const today = new Date().toDateString();
        return habit.completed_dates?.includes(today);
      }).length;
      const totalHabits = habits.length;
      const habitProgress = totalHabits > 0 ? (todayHabits / totalHabits) * 100 : 0;
      
      const recentActivities = [
        ...goals.map(g => ({...g, type: 'goal'})), 
        ...habits.map(h => ({...h, type: 'habit'}))
      ].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

      if (loading) {
        return (
          <div className="flex items-center justify-center h-full p-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        );
      }

      return (
        <>
          <Helmet>
            <title>Dashboard - SmartPlan</title>
            <meta name="description" content="Your SmartPlan dashboard - track goals, monitor habits, and view your progress at a glance." />
          </Helmet>
          
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome, {profile?.name || user?.email}!</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Here's your productivity snapshot.</p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard title="Active Goals" value={totalGoals} icon={<Target className="h-8 w-8" />} color="from-blue-500 to-indigo-600" delay={0.1} />
              <StatCard title="Completed" value={completedGoals} icon={<CheckCircle className="h-8 w-8" />} color="from-green-500 to-teal-600" delay={0.2} />
              <StatCard title="Active Habits" value={totalHabits} icon={<CalendarCheck className="h-8 w-8" />} color="from-purple-500 to-violet-600" delay={0.3} />
              <StatCard title="Today's Habits" value={`${todayHabits}/${totalHabits}`} icon={<Clock className="h-8 w-8" />} color="from-orange-500 to-amber-600" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <ProgressCard title="Goal Progress" description="Overall goal completion rate" value={goalProgress} completed={completedGoals} total={totalGoals} icon={<BarChart className="h-5 w-5 text-blue-600" />} delay={0.5} />
              <ProgressCard title="Daily Habits" description="Today's habit completion" value={habitProgress} completed={todayHabits} total={totalHabits} icon={<TrendingUp className="h-5 w-5 text-purple-600" />} delay={0.6} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                <AISuggestions />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                <Card className="card-hover h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2"><TrendingUp className="h-5 w-5 text-green-600" /><span>Recent Activity</span></CardTitle>
                    <CardDescription>Your five most recent updates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentActivities.length === 0 ? (
                      <div className="text-center py-8">
                        <Sparkles className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Let's Get Started!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Add a goal or habit to see your progress here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentActivities.map((item) => (
                          <div key={`${item.type}-${item.id}`} className="flex items-center space-x-3 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'goal' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600'}`}>
                              {item.type === 'goal' ? <Target className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.title || item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Created {new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                            {item.type === 'goal' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${item.completed ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                                {item.completed ? 'Completed' : 'In Progress'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
              <Card className="card-hover bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">Unlock Your Full Potential</h3>
                      <p className="text-indigo-100 text-sm sm:text-base">Upgrade to Pro for advanced analytics and unlimited AI.</p>
                    </div>
                    <Button onClick={handleUpgrade} className="bg-white text-indigo-600 hover:bg-gray-100 font-bold shrink-0">
                      <Sparkles className="h-4 w-4 mr-2" />Upgrade Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      );
    };

    export default Dashboard;