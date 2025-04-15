import React, { useEffect, useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-700 dark:text-white focus:outline-none"
        >
          {/* Hamburger menu */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">TrendPulse Dashboard</h1>
      </div>
      <button
        className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
};

export default Header;