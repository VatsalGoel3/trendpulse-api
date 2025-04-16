import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchTrends } from '../services/api';
import { LineChart as LineChartIcon, Plus, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

// Color palette for different queries
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

interface SentimentData {
  name: string;  
  [key: string]: number | string; // For dynamic query keys
}

const CompareQueries: React.FC = () => {
  const [queries, setQueries] = useState<string[]>(['AI trends', 'Blockchain']);
  const [newQuery, setNewQuery] = useState<string>('');
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Debug state
  const [renderDebug, setRenderDebug] = useState<string>('Waiting for user action');
  
  // Add a new query to compare
  const addQuery = () => {
    if (newQuery.trim() && queries.length < 5) {
      setQueries([...queries, newQuery.trim()]);
      setNewQuery('');
    }
  };
  
  // Remove a query from the list
  const removeQuery = (index: number) => {
    setQueries(queries.filter((_, i) => i !== index));
  };
  
  // Handle comparison
  const handleCompare = async () => {
    if (queries.length < 1) return;
    
    setLoading(true);
    setIsComparing(true);
    setError(null); // Clear any previous errors
    setRenderDebug('Fetching data...');
    
    try {
      console.log("Fetching data for queries:", queries);
      
      // Fetch data for each query sequentially to avoid overloading the API
      const results = [];
      
      for (const query of queries) {
        try {
          console.log(`Fetching data for query: ${query}`);
          const result = await fetchTrends(query);
          console.log(`Got result for ${query}:`, result);
          
          // Validate the result has the expected structure
          if (!result || !result.reddit || !result.hackernews || !result.news) {
            console.error(`Invalid result structure for query: ${query}`, result);
            throw new Error(`Invalid result for query: ${query}`);
          }
          
          results.push(result);
        } catch (queryError) {
          console.error(`Error fetching data for query: ${query}`, queryError);
          // Add a placeholder result to maintain index alignment
          results.push({
            reddit: [],
            hackernews: [],
            news: []
          });
        }
      }
      
      if (results.length === 0) {
        throw new Error("No data was returned for any query");
      }
      
      console.log("All results:", results);
      setRenderDebug('Processing data...');
      
      // Process the results into a format suitable for the chart
      const processedData = processComparisonData(results, queries);
      console.log("Processed data:", processedData);
      
      setComparisonData(processedData);
      setRenderDebug('Data processed, ready to render charts.');
    } catch (error) {
      console.error('Failed to compare queries:', error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setComparisonData(null);
      setRenderDebug('Error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Update debug info when rendering state changes
  useEffect(() => {
    let status = 'Current state: ';
    if (loading) status += 'Loading, ';
    else status += 'Not loading, ';
    
    if (isComparing) status += 'Is comparing, ';
    else status += 'Not comparing, ';
    
    if (comparisonData) status += 'Has data';
    else status += 'No data';
    
    setRenderDebug(status);
  }, [loading, isComparing, comparisonData]);
  
  // Process the data from multiple queries into a format suitable for charts
  const processComparisonData = (results: any[], queryLabels: string[]) => {
    // Calculate average sentiment for each platform for each query
    const platformData = results.map((result, index) => {
      // Default to empty arrays if data is missing
      const redditData = result.reddit || [];
      const hackernewsData = result.hackernews || [];
      const newsData = result.news || [];
      
      const redditAvg = redditData.reduce((sum: number, item: any) => {
        const sentimentValue = typeof item.sentiment === 'number' 
          ? item.sentiment 
          : typeof item.sentiment === 'object' && item.sentiment !== null
            ? (item.sentiment.score || item.sentiment.value || 0)
            : 0;
        return sum + sentimentValue;
      }, 0) / (redditData.length || 1);
      
      const hackernewsAvg = hackernewsData.reduce((sum: number, item: any) => {
        const sentimentValue = typeof item.sentiment === 'number' 
          ? item.sentiment 
          : typeof item.sentiment === 'object' && item.sentiment !== null
            ? (item.sentiment.score || item.sentiment.value || 0)
            : 0;
        return sum + sentimentValue;
      }, 0) / (hackernewsData.length || 1);
      
      const newsAvg = newsData.reduce((sum: number, item: any) => {
        const sentimentValue = typeof item.sentiment === 'number' 
          ? item.sentiment 
          : typeof item.sentiment === 'object' && item.sentiment !== null
            ? (item.sentiment.score || item.sentiment.value || 0)
            : 0;
        return sum + sentimentValue;
      }, 0) / (newsData.length || 1);
      
      // Count the posts for volume comparison
      const redditCount = redditData.length;
      const hackernewsCount = hackernewsData.length;
      const newsCount = newsData.length;
      
      return {
        query: queryLabels[index],
        redditSentiment: parseFloat(redditAvg.toFixed(2)),
        hackernewsSentiment: parseFloat(hackernewsAvg.toFixed(2)),
        newsSentiment: parseFloat(newsAvg.toFixed(2)),
        redditCount,
        hackernewsCount,
        newsCount,
        totalCount: redditCount + hackernewsCount + newsCount
      };
    });
    
    // Create chart-ready data
    const sentimentData: SentimentData[] = [
      { name: 'Reddit' },
      { name: 'Hacker News' },
      { name: 'News' }
    ];
    
    // Add data for each query
    platformData.forEach(data => {
      sentimentData[0][data.query] = data.redditSentiment;
      sentimentData[1][data.query] = data.hackernewsSentiment;
      sentimentData[2][data.query] = data.newsSentiment;
    });
    
    // Create volume comparison data
    const volumeData = queryLabels.map((label, index) => ({
      name: label,
      Reddit: platformData[index].redditCount,
      'Hacker News': platformData[index].hackernewsCount,
      News: platformData[index].newsCount
    }));
    
    return {
      sentiment: sentimentData,
      volume: volumeData,
      raw: platformData
    };
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  // Helper function to check if the chart data is valid
  const hasValidChartData = () => {
    if (!comparisonData) return false;
    
    // Check sentiment data
    const hasValidSentiment = comparisonData.sentiment && 
                             Array.isArray(comparisonData.sentiment) && 
                             comparisonData.sentiment.length > 0;
    
    // Check volume data
    const hasValidVolume = comparisonData.volume && 
                          Array.isArray(comparisonData.volume) && 
                          comparisonData.volume.length > 0;
    
    return hasValidSentiment && hasValidVolume;
  };

  // Render the basic charts without animation for debugging purposes
  const renderSimpleCharts = () => {
    if (!comparisonData || !hasValidChartData()) return null;
    
    return (
      <div className="space-y-8 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Bar Chart - Sentiments</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={comparisonData.raw}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="query" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="redditSentiment" name="Reddit" fill="#ff4500" />
                <Bar dataKey="hackernewsSentiment" name="Hacker News" fill="#ff6600" />
                <Bar dataKey="newsSentiment" name="News" fill="#1e88e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Bar Chart - Volume</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={comparisonData.volume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Reddit" fill="#ff4500" />
                <Bar dataKey="Hacker News" fill="#ff6600" />
                <Bar dataKey="News" fill="#1e88e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <LineChartIcon className="w-6 h-6 mr-2 text-indigo-600" />
        <h1 className="text-2xl font-bold">Compare Queries</h1>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-lg font-semibold mb-4"
        >
          Select queries to compare (max 5)
        </motion.h2>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-4">
          {queries.map((query, index) => (
            <div 
              key={index}
              className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full"
            >
              <span>{query}</span>
              <button 
                onClick={() => removeQuery(index)}
                className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Add search term..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            onKeyDown={(e) => e.key === 'Enter' && addQuery()}
          />
          <button
            onClick={addQuery}
            disabled={queries.length >= 5 || !newQuery.trim()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
          <button
            onClick={handleCompare}
            disabled={queries.length < 1}
            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            Compare
          </button>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4 flex items-start"
          >
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error comparing queries</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-1">Try comparing one query at a time or simplify your search terms.</p>
            </div>
          </motion.div>
        )}
        
        {/* Debug info - remove in production
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 rounded">
          <p>Debug: {renderDebug}</p>
          <p>Chart data valid: {hasValidChartData() ? 'Yes' : 'No'}</p>
        </div>*/}
      </motion.div>
      
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center min-h-[400px]"
        >
          <LoadingSpinner />
        </motion.div>
      )}
      
      {/* Non-animated charts for better reliability */}
      {!loading && isComparing && comparisonData && hasValidChartData() && renderSimpleCharts()}
    </div>
  );
};

export default CompareQueries; 