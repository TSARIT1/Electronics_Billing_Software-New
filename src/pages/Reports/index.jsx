import { BarChart4, CreditCard, Landmark, TrendingUp } from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import RevenueLineChart from "../../components/charts/LineChart";
import DonutChart from "../../components/charts/DonutChart";
import {
  paymentMethods,
  reportsStats,
  revenueVsPurchases,
} from "../../data/mockData";

const donutColors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

const Reports = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={reportsStats[0].title}
        value={reportsStats[0].value}
        icon={TrendingUp}
      />
      <StatCard
        title={reportsStats[1].title}
        value={reportsStats[1].value}
        icon={Landmark}
        accent="warning"
      />
      <StatCard
        title={reportsStats[2].title}
        value={reportsStats[2].value}
        icon={BarChart4}
        accent="success"
      />
      <StatCard
        title={reportsStats[3].title}
        value={reportsStats[3].value}
        icon={CreditCard}
      />
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <div className="border-b border-card-border px-5 py-4">
          <h3 className="text-base font-semibold text-text-main">
            Revenue vs Purchases
          </h3>
          <p className="text-xs text-text-muted">Monthly comparison</p>
        </div>
        <div className="p-5">
          <RevenueLineChart data={revenueVsPurchases} />
        </div>
      </Card>

      <Card>
        <div className="border-b border-card-border px-5 py-4">
          <h3 className="text-base font-semibold text-text-main">
            Payment Methods
          </h3>
          <p className="text-xs text-text-muted">Channel distribution</p>
        </div>
        <div className="p-5">
          <DonutChart data={paymentMethods} colors={donutColors} />
          <div className="mt-4 space-y-2 text-sm">
            {paymentMethods.map((item, index) => (
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

export default Reports;
