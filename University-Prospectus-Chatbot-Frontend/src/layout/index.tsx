import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/sidebar';

export const AppLayout: FC = () => {
  return (
    <div className="flex flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
