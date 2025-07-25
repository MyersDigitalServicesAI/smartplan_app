import React from 'react';
    import { NavLink, useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import {
      LayoutDashboard,
      Target,
      CalendarCheck,
      BrainCircuit,
      Settings,
      LogOut,
      Sparkles,
      CreditCard,
    } from 'lucide-react';

    const Sidebar = () => {
      const { user, profile, signOut } = useAuth();
      const navigate = useNavigate();

      const handleSignOut = async () => {
        await signOut();
        navigate('/login');
      };

      const navLinks = [
        { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
        { to: '/goals', icon: Target, text: 'Goals' },
        { to: '/habits', icon: CalendarCheck, text: 'Habits' },
        { to: '/ai-planner', icon: BrainCircuit, text: 'AI Planner' },
        { to: '/billing', icon: CreditCard, text: 'Billing' },
        { to: '/settings', icon: Settings, text: 'Settings' },
      ];

      const getInitials = (name) => {
        if (!name) return 'S';
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      };

      return (
        <div className="flex h-full flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 border-r border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center border-b border-slate-200 dark:border-slate-800 p-4 h-16">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="ml-2 text-2xl font-bold">SmartPlan</h1>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <link.icon className="mr-3 h-5 w-5" />
                <span>{link.text}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={profile?.name || 'User Avatar'} />
                <AvatarFallback>{getInitials(profile?.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 truncate">
                <p className="text-sm font-semibold truncate">{profile?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email || user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-start px-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      );
    };

    export default Sidebar;