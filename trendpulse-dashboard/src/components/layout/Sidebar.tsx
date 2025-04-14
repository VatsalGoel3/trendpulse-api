import React from 'react';
import { BarChart3, TrendingUp, LineChart, Settings, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 pt-6 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">TrendPulse</span>
      </div>
      
      <nav className="px-4 py-2 mt-2">
        <div className="mb-4">
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-2">Analytics</p>
          <div className="space-y-1">
            <a href="#" className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <LineChart className="w-5 h-5 mr-2" />
              <span>Compare Queries</span>
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span>Top Trends</span>
            </a>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-2">Account</p>
          <div className="space-y-1">
            <a href="#" className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <User className="w-5 h-5 mr-2" />
              <span>Profile</span>
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Settings className="w-5 h-5 mr-2" />
              <span>Settings</span>
            </a>
          </div>
        </div>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-center text-gray-500 dark:text-gray-400">
        Version 1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;