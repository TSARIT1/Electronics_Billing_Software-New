import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisStyle = {
  fill: "rgb(var(--color-text-muted))",
  fontSize: 12,
};

const RevenueLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgb(var(--color-card-border))"
        vertical={false}
      />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisStyle} />
      <YAxis tickLine={false} axisLine={false} tick={axisStyle} />
      <Tooltip
        contentStyle={{
          borderRadius: 12,
          borderColor: "rgb(var(--color-card-border))",
          backgroundColor: "rgb(var(--color-surface))",
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
