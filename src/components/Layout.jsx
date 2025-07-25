import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-gray-900">
      <div className="hidden w-64 flex-shrink-0 md:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;