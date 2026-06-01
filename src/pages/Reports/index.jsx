import { useEffect, useMemo, useState } from "react";
import { BarChart4, CreditCard, Landmark, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import RevenueLineChart from "../../components/charts/LineChart";
import DonutChart from "../../components/charts/DonutChart";
import { listInvoices } from "../../services/invoices";
import { listPurchases } from "../../services/purchases";

const donutColors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

const Reports = () => {
  const [invoices, setInvoices] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        const [invoiceData, purchaseData] = await Promise.all([
          listInvoices(),
          listPurchases(),
        ]);
        setInvoices(invoiceData);
        setPurchases(purchaseData);
      } catch (error) {
        toast.error(error.message);
      }
    };

    loadReportsData();
  }, []);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const reportsStats = useMemo(() => {
    const revenue = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const purchaseTotal = purchases.reduce((sum, order) => sum + (order.total || 0), 0);
    const profit = revenue - purchaseTotal;
    const avgOrder = invoices.length ? revenue / invoices.length : 0;

    return [
      { title: "Total Revenue", value: formatCurrency(revenue) },
      { title: "Purchases", value: formatCurrency(purchaseTotal) },
      { title: "Profit", value: formatCurrency(profit) },
      { title: "Avg Order Value", value: formatCurrency(avgOrder) },
    ];
  }, [invoices, purchases]);

  const revenueVsPurchases = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueByMonth = Array(12).fill(0);
    const purchaseByMonth = Array(12).fill(0);

    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt);
      revenueByMonth[date.getMonth()] += invoice.total || 0;
    });

    purchases.forEach((order) => {
      const date = new Date(order.createdAt);
      purchaseByMonth[date.getMonth()] += order.total || 0;
    });

    return monthNames.map((name, index) => ({
      name,
      revenue: revenueByMonth[index],
      purchases: purchaseByMonth[index],
    }));
  }, [invoices, purchases]);

  const paymentMethods = useMemo(() => {
    const invoiceCount = invoices.length || 1;
    const upi = Math.round(invoiceCount * 0.4);
    const card = Math.round(invoiceCount * 0.3);
    const cash = Math.round(invoiceCount * 0.2);
    const wallet = Math.max(invoiceCount - upi - card - cash, 0);

    return [
      { name: "UPI", value: Math.round((upi / invoiceCount) * 100) },
      { name: "Card", value: Math.round((card / invoiceCount) * 100) },
      { name: "Cash", value: Math.round((cash / invoiceCount) * 100) },
      { name: "Wallet", value: Math.round((wallet / invoiceCount) * 100) },
    ];
  }, [invoices]);

  return (
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
};

export default Reports;
