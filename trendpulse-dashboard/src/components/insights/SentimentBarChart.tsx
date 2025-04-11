import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SentimentBarChartProps {
  reddit: any[];
  hackernews: any[];
  news: any[];
}

const getCounts = (posts: any[]) => {
  return {
    Positive: posts.filter(p => p.sentiment.label === 'Positive').length,
    Neutral: posts.filter(p => p.sentiment.label === 'Neutral').length,
    Negative: posts.filter(p => p.sentiment.label === 'Negative').length,
  };
};

const SentimentBarChart: React.FC<SentimentBarChartProps> = ({ reddit, hackernews, news }) => {
  const data = [
    { name: 'Reddit', ...getCounts(reddit) },
    { name: 'Hacker News', ...getCounts(hackernews) },
    { name: 'NewsAPI', ...getCounts(news) },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Positive" fill="#00C49F" />
        <Bar dataKey="Neutral" fill="#FFBB28" />
        <Bar dataKey="Negative" fill="#FF8042" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SentimentBarChart;