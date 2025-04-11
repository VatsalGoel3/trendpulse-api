import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import TrendChart from './components/TrendChart';
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">TrendPulse Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p className="mt-4">Loading...</p>}
      {results && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">Trends Summary</h2>
          <TrendChart trends={results.trends} />
        </div>
      )}
    </div>
  );
};

export default App;