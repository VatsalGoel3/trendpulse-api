// src/App.tsx
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Header from './components/layout/Header';
import Section from './components/layout/Section';
import TrendChart from './components/insights/TrendChart';
import SentimentBarChart from './components/insights/SentimentBarChart';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Header title="TrendPulse Dashboard" />
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {results && (
        <>
          <Section title="Trends Summary">
            <TrendChart
              reddit={results.reddit}
              hackernews={results.hackernews}
              news={results.news}
            />
          </Section>

          <Section title="Sentiment Distribution">
            <SentimentBarChart
              reddit={results.reddit}
              hackernews={results.hackernews}
              news={results.news}
            />
          </Section>

          <Section title="Top Posts by Sentiment">
            <SentimentDetails source="Reddit" posts={results.reddit.slice(0, 3)} />
            <SentimentDetails source="Hacker News" posts={results.hackernews.slice(0, 3)} />
            <SentimentDetails source="NewsAPI" posts={results.news.slice(0, 3)} />
          </Section>

          <Section title="All Posts (Full Data)">
            <DataTable source="Reddit" data={results.reddit} />
            <DataTable source="Hacker News" data={results.hackernews} />
            <DataTable source="NewsAPI" data={results.news} />
          </Section>
        </>
      )}
    </div>
  );
};

export default App;