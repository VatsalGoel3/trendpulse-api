import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import SearchBar from './components/SearchBar';
import TrendChart from './components/insights/TrendChart';
import SentimentDetails from './components/insights/SentimentDetails';
import SentimentBarChart from './components/insights/SentimentBarChart';
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
    <Layout>
      <SearchBar onSearch={handleSearch} />
      {loading && <p className="mt-4 text-center">Loading...</p>}
      {results && (
        <div className="mt-6 space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Trends Summary</h2>
            <TrendChart
              reddit={results.reddit}
              hackernews={results.hackernews}
              news={results.news}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Sentiment Distribution</h2>
            <SentimentBarChart
              reddit={results.reddit}
              hackernews={results.hackernews}
              news={results.news}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Top Posts by Sentiment</h2>
            <SentimentDetails source="Reddit" posts={results.reddit.slice(0, 3)} />
            <SentimentDetails source="Hacker News" posts={results.hackernews.slice(0, 3)} />
            <SentimentDetails source="NewsAPI" posts={results.news.slice(0, 3)} />
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">All Posts (Full Data)</h2>
            <DataTable source="Reddit" data={results.reddit} />
            <DataTable source="Hacker News" data={results.hackernews} />
            <DataTable source="NewsAPI" data={results.news} />
          </section>
        </div>
      )}
    </Layout>
  );
};

export default App;