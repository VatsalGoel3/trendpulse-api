import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import TrendChart from './components/insights/TrendChart';
import SentimentDetails from './components/insights/SentimentDetails';
import DataTable from './components/DataTable';
import { fetchTrends } from './services/api';

const App: React.FC = () => {
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">TrendPulse Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p className="mt-4 text-center">Loading...</p>}
      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Trends Summary</h2>
          <TrendChart
            reddit={results.reddit}
            hackernews={results.hackernews}
            news={results.news}
          />


          <div className="mt-8">
            <SentimentDetails source="Reddit" posts={results.reddit.slice(0, 3)} />
            <SentimentDetails source="Hacker News" posts={results.hackernews.slice(0, 3)} />
            <SentimentDetails source="NewsAPI" posts={results.news.slice(0, 3)} />
          </div>

          <div className="mt-10">
            <DataTable source="Reddit" data={results.reddit} />
            <DataTable source="Hacker News" data={results.hackernews} />
            <DataTable source="NewsAPI" data={results.news} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;