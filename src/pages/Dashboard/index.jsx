import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarRange,
  Wallet,
} from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import SalesBarChart from "../../components/charts/SalesBarChart";
import DonutChart from "../../components/charts/DonutChart";
import {
  categoryBreakdown,
  dashboardStats,
  salesOverview,
} from "../../data/mockData";

const donutColors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

const Dashboard = () => {
  const statIcons = [Wallet, CalendarRange, BadgeDollarSign, AlertTriangle];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={statIcons[index]}
            accent={index === 3 ? "danger" : "primary"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-3 border-b border-card-border px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-main">
                Sales Overview
              </h3>
              <p className="text-xs text-text-muted">
                Weekly performance snapshot
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                className="rounded-full bg-white px-3 py-1 text-primary shadow-soft"
              >
                Weekly
              </button>
              <button
                type="button"
                className="rounded-full px-3 py-1 text-text-muted"
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="p-5">
            <SalesBarChart data={salesOverview} />
          </div>
        </Card>

        <Card>
          <div className="border-b border-card-border px-5 py-4">
            <h3 className="text-base font-semibold text-text-main">
              Category Breakdown
            </h3>
            <p className="text-xs text-text-muted">Sales by category</p>
          </div>
          <div className="p-5">
            <DonutChart data={categoryBreakdown} colors={donutColors} />
            <div className="mt-4 space-y-2 text-sm">
              {categoryBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: donutColors[index] }}
                  />
                  <span className="text-text-muted">{item.name}</span>
                  <span className="ml-auto font-semibold text-text-main">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
