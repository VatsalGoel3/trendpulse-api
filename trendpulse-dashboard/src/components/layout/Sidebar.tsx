import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden lg:block">
      <nav className="space-y-4">
        <p className="text-sm text-gray-400 uppercase">Sections</p>
        <a href="#" className="block hover:underline">Dashboard</a>
        <a href="#" className="block hover:underline">Compare Queries</a>
        <a href="#" className="block hover:underline">Top Trends</a>
      </nav>
    </aside>
  );
};

export default Sidebar;