import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const axisStyle = {
  fill: "rgb(var(--color-text-muted))",
  fontSize: 12,
};

const DonutChart = ({ data, colors }) => (
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie
        data={data}
        innerRadius={70}
        outerRadius={100}
        paddingAngle={3}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          borderRadius: 12,
          borderColor: "rgb(var(--color-card-border))",
          backgroundColor: "rgb(var(--color-surface))",
          boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
);

export default DonutChart;
