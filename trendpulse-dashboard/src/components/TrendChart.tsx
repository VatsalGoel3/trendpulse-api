import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

interface TrendChartProps {
  trends: any;
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const TrendChart: React.FC<TrendChartProps> = ({ trends }) => {
  const data = [
    { name: 'Positive', value: Object.values(trends).filter(t => t.overall_sentiment === 'Positive').length },
    { name: 'Neutral', value: Object.values(trends).filter(t => t.overall_sentiment === 'Neutral').length },
    { name: 'Negative', value: Object.values(trends).filter(t => t.overall_sentiment === 'Negative').length },
  ];

  return (
    <PieChart width={400} height={250}>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label>
        {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default TrendChart;