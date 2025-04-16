import React from 'react';
import { BarChart3, TrendingUp, LineChart, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };
  
  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
    closed: { opacity: 0, y: 20, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };
  
  const itemTransition = {
    open: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closed: { y: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-gray-100 dark:bg-gray-700" : "";
  };

  return (
    <motion.aside
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
    >
      <motion.div 
        className="p-4 pt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">TrendPulse</span>
      </motion.div>
      
      <motion.nav 
        className="px-4 py-2 mt-2"
        variants={itemVariants}
        initial="closed"
        animate="open"
      >
        <div className="mb-4">
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-2">Analytics</p>
          <div className="space-y-1">
            <motion.div variants={itemTransition}>
              <Link 
                to="/" 
                className={`flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 rounded-md ${isActive('/')}`}
                onClick={() => onClose()}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                <span>Dashboard</span>
              </Link>
            </motion.div>
            <motion.div variants={itemTransition}>
              <Link 
                to="/compare" 
                className={`flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 rounded-md ${isActive('/compare')}`}
                onClick={() => onClose()}
              >
                <LineChart className="w-5 h-5 mr-2" />
                <span>Compare Queries</span>
              </Link>
            </motion.div>
            <motion.div variants={itemTransition}>
              <Link 
                to="/top-trends" 
                className={`flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 rounded-md ${isActive('/top-trends')}`}
                onClick={() => onClose()}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>Top Trends</span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-2">Account</p>
          <div className="space-y-1">
            <motion.div variants={itemTransition}>
              <Link 
                to="/profile" 
                className={`flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 rounded-md ${isActive('/profile')}`}
                onClick={() => onClose()}
              >
                <User className="w-5 h-5 mr-2" />
                <span>Profile</span>
              </Link>
            </motion.div>
            <motion.div variants={itemTransition}>
              <Link 
                to="/settings" 
                className={`flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 rounded-md ${isActive('/settings')}`}
                onClick={() => onClose()}
              >
                <Settings className="w-5 h-5 mr-2" />
                <span>Settings</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 text-xs text-center text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Version 1.0.0
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;