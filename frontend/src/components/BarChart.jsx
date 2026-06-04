import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const weeklyApplicationData = [
  { week: 'Week 1', applications: 4 },
  { week: 'Week 2', applications: 7 },
  { week: 'Week 3', applications: 5 },
  { week: 'Week 4', applications: 9 },
];

function BarChart() {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Applications Per Week</h2>
        <p className="mt-1 text-sm text-gray-600">
          Basic bar chart structure for Sprint 3 dashboard data.
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={weeklyApplicationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Bar dataKey="applications" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default BarChart;
