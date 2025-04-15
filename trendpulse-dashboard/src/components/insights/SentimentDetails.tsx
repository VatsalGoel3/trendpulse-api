import React from 'react';

interface Post {
  title: string;
  sentiment: {
    label: string;
    score: number;
  };
  url: string;
}

interface SentimentDetailsProps {
  source: string;
  posts: Post[];
}

const SentimentDetails: React.FC<SentimentDetailsProps> = ({ source, posts }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{source} - Top Sentiment Posts</h3>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="bg-white p-4 rounded shadow border">
            <p className="font-medium">{post.title}</p>
            <p className="text-sm text-gray-600">
              Sentiment: {post.sentiment.label} ({post.sentiment.score})
            </p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View Source
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentDetails;