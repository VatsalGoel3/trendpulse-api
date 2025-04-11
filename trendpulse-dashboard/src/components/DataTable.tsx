import React from 'react';

interface Post {
  title: string;
  sentiment: {
    label: string;
    score: number;
  };
  url: string;
}

interface DataTableProps {
  source: string;
  data: Post[];
}

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
            <th className="px-4 py-2 border-b">Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{item.title}</td>
              <td className="px-4 py-2 border-b">{item.sentiment.label}</td>
              <td className="px-4 py-2 border-b">{item.sentiment.score}</td>
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