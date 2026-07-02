import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
    <div className="rounded-xl border border-slate-700/50 bg-[#0f172a]/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <div className="text-sm font-bold text-white mb-2">{label}</div>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm font-semibold mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: entry.color }}>
            {entry.name.toLowerCase()} : {currency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const RevenueBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} barSize={12} barGap={4}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgb(var(--color-card-border))"
        vertical={false}
      />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisStyle} />
      <YAxis 
        tickLine={false} 
        axisLine={false} 
        tick={axisStyle} 
        tickFormatter={(v) => (v >= 100000 ? `${(v/100000).toFixed(1)}L` : v >= 1000 ? `${(v/1000).toFixed(1)}k` : v)} 
      />
      <Tooltip
        cursor={{ fill: "rgba(255,255,255,0.02)" }}
        content={<CustomTooltip />}
      />
      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'rgb(var(--color-text-muted))' }} />
      <Bar name="Revenue" dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} animationDuration={800} />
      <Bar name="Purchases" dataKey="purchases" fill="#F59E0B" radius={[4, 4, 0, 0]} animationDuration={800} />
    </BarChart>
  </ResponsiveContainer>
);

export default RevenueBarChart;
