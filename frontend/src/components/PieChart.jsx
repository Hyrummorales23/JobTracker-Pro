import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
} from 'recharts';

const statusData = [
  { name: 'Wishlist', value: 3, color: '#64748b' },
  { name: 'Applied', value: 8, color: '#2563eb' },
  { name: 'Interview', value: 4, color: '#f59e0b' },
  { name: 'Offer', value: 1, color: '#16a34a' },
  { name: 'Rejected', value: 2, color: '#dc2626' },
];

function PieChart() {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Status Breakdown</h2>
        <p className="mt-1 text-sm text-gray-600">
          Basic pie chart structure for Sprint 3 dashboard data.
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PieChart;
