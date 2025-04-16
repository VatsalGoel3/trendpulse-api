import React, { useState, useEffect } from 'react';
import { fetchTrends } from '../services/api';
import { TrendingUp, ArrowUpRight, ArrowDownRight, BarChart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

interface TrendItem {
  title: string;
  sentiment: number | string;
  url: string;
  source: string;
  votes?: number;
  comments?: number;
}

// Platform logo components
const RedditLogo = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const HackerNewsLogo = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0v24h24V0H0zm12.593 20.733c-3.375 0-6.109-2.736-6.109-6.111s2.734-6.109 6.109-6.109c3.377 0 6.111 2.734 6.111 6.109s-2.734 6.111-6.111 6.111zm0-10.02c-2.156 0-3.909 1.752-3.909 3.909 0 2.159 1.753 3.911 3.909 3.911 2.158 0 3.911-1.752 3.911-3.911 0-2.156-1.753-3.909-3.911-3.909z" />
  </svg>
);

const TopTrends: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [trendingTopics, setTrendingTopics] = useState<{
    reddit: TrendItem[],
    hackernews: TrendItem[],
    news: TrendItem[]
  } | null>(null);

  useEffect(() => {
    const fetchTopTrends = async () => {
      setLoading(true);
      try {
        // Fetch data for popular tech topics
        const techTrends = await fetchTrends('tech trends');
        console.log('API Response:', techTrends);
        
        // Process the data to ensure sentiment values are correctly structured
        const processedData = {
          reddit: techTrends.reddit.map((item: any) => ({
            ...item,
            // Check if sentiment is nested in an object
            sentiment: typeof item.sentiment === 'object' && item.sentiment !== null 
              ? item.sentiment.score || item.sentiment.value || 0 
              : item.sentiment
          })),
          hackernews: techTrends.hackernews.map((item: any) => ({
            ...item,
            sentiment: typeof item.sentiment === 'object' && item.sentiment !== null 
              ? item.sentiment.score || item.sentiment.value || 0 
              : item.sentiment
          })),
          news: techTrends.news.map((item: any) => ({
            ...item,
            sentiment: typeof item.sentiment === 'object' && item.sentiment !== null 
              ? item.sentiment.score || item.sentiment.value || 0 
              : item.sentiment
          }))
        };
        
        console.log('Processed data:', processedData);
        setTrendingTopics(processedData);
      } catch (error) {
        console.error('Failed to fetch top trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTrends();
  }, []);

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

  // Helper to ensure sentiment is a number and has a default value
  const getSentimentValue = (sentiment: any): number => {
    if (typeof sentiment === 'number') {
      return sentiment;
    }
    
    if (typeof sentiment === 'object' && sentiment !== null) {
      // If sentiment is an object, try to get score or value property
      return Number(sentiment.score || sentiment.value || 0);
    }
    
    try {
      // Try to convert to number if it's a string
      const num = Number(sentiment);
      return isNaN(num) ? 0 : num;
    } catch {
      return 0;
    }
  };

  const getSentimentColor = (sentiment: any) => {
    const value = getSentimentValue(sentiment);
    if (value > 0.3) return 'text-green-500';
    if (value < -0.3) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getSentimentIcon = (sentiment: any) => {
    const value = getSentimentValue(sentiment);
    if (value > 0.3) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (value < -0.3) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <BarChart className="w-4 h-4 text-yellow-500" />;
  };

  const formatSentiment = (sentiment: any): string => {
    const value = getSentimentValue(sentiment);
    return (value > 0 ? '+' : '') + value.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <LoadingSpinner />
      </div>
    );
  }

  // If no data is available, show a message
  if (!trendingTopics || 
      !trendingTopics.reddit || 
      !trendingTopics.hackernews || 
      !trendingTopics.news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">No trending data available</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
        <h1 className="text-2xl font-bold">Top Trending Topics</h1>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="col-span-full lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-red-500 font-bold flex items-center">
                <RedditLogo />
                Reddit
              </span>
              <span className="ml-2">Hot Topics</span>
            </h2>
            <div className="space-y-4">
              {trendingTopics.reddit.slice(0, 5).map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`flex items-center ${getSentimentColor(item.sentiment)}`}>
                          {getSentimentIcon(item.sentiment)}
                          <span className="ml-1">
                            {formatSentiment(item.sentiment)}
                          </span>
                        </span>
                        {item.votes !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            {item.votes} votes • {item.comments} comments
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-full lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-orange-500 font-bold flex items-center">
                <HackerNewsLogo />
                Hacker News
              </span>
              <span className="ml-2">Top Stories</span>
            </h2>
            <div className="space-y-4">
              {trendingTopics.hackernews.slice(0, 5).map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`flex items-center ${getSentimentColor(item.sentiment)}`}>
                          {getSentimentIcon(item.sentiment)}
                          <span className="ml-1">
                            {formatSentiment(item.sentiment)}
                          </span>
                        </span>
                        {item.votes !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                            {item.votes} points • {item.comments} comments
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-full lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-blue-500 font-bold flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                News
              </span>
              <span className="ml-2">Headlines</span>
            </h2>
            <div className="space-y-4">
              {trendingTopics.news.slice(0, 5).map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`flex items-center ${getSentimentColor(item.sentiment)}`}>
                          {getSentimentIcon(item.sentiment)}
                          <span className="ml-1">
                            {formatSentiment(item.sentiment)}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                          {item.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TopTrends; 