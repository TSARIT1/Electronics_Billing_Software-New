import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisStyle = {
  fill: "rgb(var(--color-text-muted))",
  fontSize: 12,
};

const currency = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border px-3 py-2 shadow" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="text-xs text-text-muted">{label}</div>
      <div className="font-semibold">{currency(payload[0].value)}</div>
    </div>
  );
};

const SalesBarChart = ({ data, color = '#4F46E5' }) => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={data} barSize={28}>
      <defs>
        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.92} />
          <stop offset="100%" stopColor={color} stopOpacity={0.18} />
        </linearGradient>
      </defs>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgb(var(--color-card-border))"
        vertical={false}
      />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisStyle} />
      <YAxis tickLine={false} axisLine={false} tick={axisStyle} tickFormatter={(v) => (v >= 1000 ? `${(v/1000).toFixed(1)}k` : v)} />
      <Tooltip
        cursor={{ fill: "rgba(79,70,229,0.06)" }}
        content={<CustomTooltip />}
      />
      <Bar dataKey="sales" fill="url(#salesGradient)" radius={[8, 8, 0, 0]} animationDuration={800} />
    </BarChart>
  </ResponsiveContainer>
);

export default SalesBarChart;
