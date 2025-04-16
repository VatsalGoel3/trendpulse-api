import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SearchBar from './components/SearchBar';
import TrendChart from './components/insights/TrendChart';
import SentimentDetails from './components/insights/SentimentDetails';
import SentimentBarChart from './components/insights/SentimentBarChart';
import DataTable from './components/DataTable';
import LoadingSpinner from './components/LoadingSpinner';
import TopTrends from './pages/TopTrends';
import { fetchTrends } from './services/api.ts';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await fetchTrends(query);
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center min-h-[400px]"
          >
            <LoadingSpinner />
          </motion.div>
        ) : results && (
          <motion.div 
            key="results"
            className="mt-6 space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-4">Trends Summary</h2>
              <TrendChart
                reddit={results.reddit}
                hackernews={results.hackernews}
                news={results.news}
              />
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-lg font-semibold mb-2">Sentiment Distribution</h2>
              <SentimentBarChart
                reddit={results.reddit}
                hackernews={results.hackernews}
                news={results.news}
              />
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-lg font-semibold mb-4">Top Posts by Sentiment</h2>
              <SentimentDetails source="Reddit" posts={results.reddit.slice(0, 3)} />
              <SentimentDetails source="Hacker News" posts={results.hackernews.slice(0, 3)} />
              <SentimentDetails source="NewsAPI" posts={results.news.slice(0, 3)} />
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold mb-2">All Posts (Full Data)</h2>
              <DataTable source="Reddit" data={results.reddit} />
              <DataTable source="Hacker News" data={results.hackernews} />
              <DataTable source="NewsAPI" data={results.news} />
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/top-trends" element={<TopTrends />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;