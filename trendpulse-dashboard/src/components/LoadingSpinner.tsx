import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  // Create an array of bar heights to simulate a chart/trend visualization
  const barHeights = [0.4, 0.7, 0.5, 0.8, 0.6, 0.9, 0.5, 0.7, 0.3];
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div 
        className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Analyzing trends
      </motion.div>
      
      <div className="flex items-end h-20 gap-1 px-2">
        {barHeights.map((height, i) => (
          <motion.div
            key={i}
            className="bg-blue-500 dark:bg-blue-600 rounded-t w-6"
            initial={{ height: 0 }}
            animate={{ 
              height: `${height * 5}rem`,
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              height: { duration: 0.5, delay: i * 0.05 },
              opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: i * 0.1 }
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="flex space-x-1 mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
