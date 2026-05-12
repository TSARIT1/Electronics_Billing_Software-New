import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SalesBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={data} barSize={28}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF5" vertical={false} />
      <XAxis dataKey="name" tickLine={false} axisLine={false} />
      <YAxis tickLine={false} axisLine={false} />
      <Tooltip
        cursor={{ fill: "rgba(79,70,229,0.08)" }}
        contentStyle={{
          borderRadius: 12,
          borderColor: "#E8ECF5",
          boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        }}
      />
      <Bar dataKey="sales" fill="#4F46E5" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default SalesBarChart;
