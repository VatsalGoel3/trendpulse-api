// src/components/TrendChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042']; // Positive, Neutral, Negative

interface Post {
  sentiment: {
    label: string;
    score: number;
  } | string; // fallback if it's just a string
}

interface TrendChartProps {
  reddit: Post[];
  hackernews: Post[];
  news: Post[];
}

const TrendChart: React.FC<TrendChartProps> = ({ reddit, hackernews, news }) => {
  const allPosts = [...reddit, ...hackernews, ...news];

  const sentimentCounts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  allPosts.forEach((post) => {
    const label = typeof post.sentiment === 'string'
      ? post.sentiment
      : post.sentiment?.label ?? 'Neutral';

    if (label in sentimentCounts) {
      sentimentCounts[label as keyof typeof sentimentCounts]++;
    }
  });

  const data = Object.entries(sentimentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="flex justify-center">
      <PieChart width={400} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TrendChart;