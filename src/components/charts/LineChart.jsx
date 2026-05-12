import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RevenueLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF5" vertical={false} />
      <XAxis dataKey="name" tickLine={false} axisLine={false} />
      <YAxis tickLine={false} axisLine={false} />
      <Tooltip
        contentStyle={{
          borderRadius: 12,
          borderColor: "#E8ECF5",
          boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        }}
      />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#4F46E5"
        strokeWidth={3}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="purchases"
        stroke="#22C55E"
        strokeWidth={3}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default RevenueLineChart;
