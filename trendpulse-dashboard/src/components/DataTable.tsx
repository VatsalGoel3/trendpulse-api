import React from 'react';
import clsx from 'clsx';

interface Post {
  title: string;
  sentiment: {
    label: string;
    score: number;
  };
  url: string;
  created?: string | number; // timestamp
}

interface DataTableProps {
  source: string;
  data: Post[];
}

const sentimentColor = {
  Positive: 'bg-green-100 text-green-700',
  Neutral: 'bg-gray-100 text-gray-700',
  Negative: 'bg-red-100 text-red-700',
};

const DataTable: React.FC<DataTableProps> = ({ source, data }) => {
  return (
    <div className="overflow-x-auto mb-10">
      <h3 className="text-lg font-semibold mb-2">{source} - All Posts</h3>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Sentiment</th>
            <th className="px-4 py-2 border-b">Score</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{item.title}</td>
              <td className="px-4 py-2 border-b">
                <span className={clsx("px-2 py-1 rounded text-xs font-medium", sentimentColor[item.sentiment.label])}>
                  {item.sentiment.label}
                </span>
              </td>
              <td className="px-4 py-2 border-b">{item.sentiment.score}</td>
              <td className="px-4 py-2 border-b">
                {item.created ? new Date(item.created).toLocaleString() : 'N/A'}
              </td>
              <td className="px-4 py-2 border-b">
                <a href={item.url} target="_blank" className="text-blue-500 hover:underline text-sm">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;