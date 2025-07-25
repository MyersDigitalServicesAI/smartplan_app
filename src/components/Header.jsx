import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  LayoutDashboard, 
  Target, 
  Calendar, 
  Settings, 
  LogOut, 
  Brain,
  BrainCircuit
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/habits', label: 'Habits', icon: Calendar },
  { href: '/ai-planner', label: 'AI Planner', icon: BrainCircuit },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700">
        <Brain className="h-8 w-8 text-blue-600" />
        <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">SmartPlan</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-red-100 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Header;