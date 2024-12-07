import React from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

export function DashboardContent() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 p-8 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}