import React from 'react';

interface SentimentDetailsProps {
  source: string;
  data: { title: string; sentiment: { label: string; score: number }; url?: string }[];
}

const SentimentDetails: React.FC<SentimentDetailsProps> = ({ source, data }) => {
  const topPosts = data.slice(0, 3); // Show top 3 for now

  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-2">{source} - Top Sentiment Posts</h3>
      <ul className="space-y-2">
        {topPosts.map((item, idx) => (
          <li key={idx} className="border p-2 rounded bg-gray-50">
            <p className="font-semibold">{item.title}</p>
            <p>
              Sentiment: <strong>{item.sentiment.label}</strong> (
              {Math.round(item.sentiment.score * 100) / 100})
            </p>
            {item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                View Source
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentimentDetails;