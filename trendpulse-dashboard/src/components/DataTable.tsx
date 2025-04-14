import React from 'react';
import clsx from 'clsx';

interface Post {
  title: string;
  sentiment: {
    label: 'Positive' | 'Neutral' | 'Negative';
    score: number;
  };
  url: string;
  created?: string | number;
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
    <div className="overflow-x-auto mb-10 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 px-4 pt-4">{source} - All Posts</h3>
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Sentiment</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Link</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2">{item.title}</td>
              <td className="px-4 py-2">
                <span className={clsx("px-2 py-1 rounded font-medium text-xs", sentimentColor[item.sentiment.label])}>
                  {item.sentiment.label}
                </span>
              </td>
              <td className="px-4 py-2">{item.sentiment.score.toFixed(2)}</td>
              <td className="px-4 py-2">
                {item.created ? new Date(item.created).toLocaleString() : 'N/A'}
              </td>
              <td className="px-4 py-2">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
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