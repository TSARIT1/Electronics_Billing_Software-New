import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BadgeDollarSign, CalendarRange, ShoppingBag, ShoppingCart, Wallet, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import SalesBarChart from "../../components/charts/SalesBarChart";
import DonutChart from "../../components/charts/DonutChart";
import { listInvoices } from "../../services/invoices";
import { listProducts } from "../../services/products";

const donutColors = ["#f59e0b", "#ef4444", "#3b82f6", "#10b981"];

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [period, setPeriod] = useState("weekly");
  const statIcons = [Wallet, CalendarRange, BadgeDollarSign, AlertTriangle];
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [invoiceData, productData] = await Promise.all([listInvoices(), listProducts()]);
        setInvoices(invoiceData);
        setProducts(productData);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard data");
      }
    };
    load();
  }, []);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const dashboardStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.toDateString();

    const monthlySales = invoices
      .filter((inv) => {
        const d = new Date(inv.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((s, inv) => s + (inv.total || 0), 0);

    const weekCut = new Date();
    weekCut.setDate(weekCut.getDate() - 7);
    const weeklySales = invoices.filter((inv) => new Date(inv.createdAt) >= weekCut).reduce((s, inv) => s + (inv.total || 0), 0);

    const todaysSales = invoices.filter((inv) => new Date(inv.createdAt).toDateString() === today).reduce((s, inv) => s + (inv.total || 0), 0);

    const stockAlerts = products.filter((p) => p.status === "Low" || p.status === "Out of Stock").length;

    return [
      { title: "Monthly Sales", value: formatCurrency(monthlySales), change: "Live" },
      { title: "Weekly Sales", value: formatCurrency(weeklySales), change: "Live" },
      { title: "Today's Sales", value: formatCurrency(todaysSales), change: "Live" },
      { title: "Stock Alerts", value: `${stockAlerts} Items`, change: "Live" },
    ];
  }, [invoices, products]);

  const salesOverview = useMemo(() => {
    const now = new Date();
    if (period === "weekly") {
      const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const totals = new Array(7).fill(0);
      invoices.forEach((inv) => {
        const d = new Date(inv.createdAt);
        const day = d.getDay();
        const idx = day === 0 ? 6 : day - 1;
        totals[idx] += inv.total || 0;
      });
      return names.map((n, i) => ({ name: n, sales: totals[i] }));
    }

    const months = [];
    const totals = new Array(12).fill(0);
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString(undefined, { month: "short" }));
    }
    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff < 12) {
        const idx = 11 - diff;
        totals[idx] += inv.total || 0;
      }
    });
    return months.map((m, i) => ({ name: m, sales: totals[i] }));
  }, [invoices, period]);

  const periodTotals = useMemo(() => {
    const total = salesOverview.reduce((s, it) => s + (it.sales || 0), 0);
    const now = new Date();
    let prev = 0;
    if (period === "weekly") {
      const start = new Date();
      start.setDate(now.getDate() - 14);
      const end = new Date();
      end.setDate(now.getDate() - 7);
      prev = invoices.filter((inv) => {
        const d = new Date(inv.createdAt);
        return d >= start && d < end;
      }).reduce((s, inv) => s + (inv.total || 0), 0);
    } else {
      prev = invoices.filter((inv) => {
        const d = new Date(inv.createdAt);
        const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        return diff >= 12 && diff < 24;
      }).reduce((s, inv) => s + (inv.total || 0), 0);
    }
    return { total, prev };
  }, [salesOverview, invoices, period]);

  const categoryBreakdown = useMemo(() => {
    const map = products.reduce((acc, p) => {
      const k = p.category || "Uncategorized";
      acc[k] = (acc[k] || 0) + ((p.price || 0) * (p.quantity || 0));
      return acc;
    }, {});
    const totalVal = Object.values(map).reduce((s, v) => s + v, 0);
    const entries = Object.entries(map).slice(0, 4);
    return entries.length ? entries.map(([name, value]) => ({ name, value: totalVal > 0 ? Math.round((value / totalVal) * 100) : 0 })) : [{ name: "No Data", value: 100 }];
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} change={stat.change} icon={statIcons[i]} accent={i === 3 ? "danger" : "primary"} />
        ))}
      </div>

      <Card className="overflow-hidden border border-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
        <div className="flex flex-col gap-4 rounded-[28px] bg-gradient-to-r from-[#f59e0b] via-[#f59e0b] to-[#ef4444] px-5 py-5 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] font-bold text-slate-900/80">Quick Actions</p>
            <h3 className="mt-2 text-xl font-bold">Start your most used workflows faster</h3>
            <p className="mt-1 max-w-xl text-sm font-semibold text-slate-900/80">Access billing, inventory management, and purchase orders right from the dashboard.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/billing")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950/20 px-4 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-950/30 transition duration-300 hover:bg-slate-950/30 hover:-translate-y-0.5"
            >
              <ShoppingCart size={18} />
              Create Invoice
            </button>
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950/20 px-4 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-950/30 transition duration-300 hover:bg-slate-950/30 hover:-translate-y-0.5"
            >
              <Boxes size={18} />
              Inventory
            </button>
            <button
              type="button"
              onClick={() => navigate("/purchase")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950/20 px-4 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-950/30 transition duration-300 hover:bg-slate-950/30 hover:-translate-y-0.5"
            >
              <ShoppingBag size={18} />
              New Purchase
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-3 border-b border-card-border px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-main">Sales Overview</h3>
              <p className="text-xs text-text-muted">{period === 'weekly' ? 'Weekly performance snapshot' : 'Last 12 months'}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-3">
                <div className="text-sm text-text-muted">Total</div>
                <div className="text-lg font-semibold text-text-main">{formatCurrency(periodTotals.total)}</div>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-slate-900 p-1 text-xs font-semibold border border-amber-500/10 shadow-inner shadow-amber-500/5">
                <button type="button" onClick={() => setPeriod('weekly')} className={"rounded-full px-4 py-1.5 transition " + (period === 'weekly' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-slate-200')}>Weekly</button>
                <button type="button" onClick={() => setPeriod('monthly')} className={"rounded-full px-4 py-1.5 transition " + (period === 'monthly' ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-slate-200')}>Monthly</button>
              </div>

              <div className="ml-4 text-sm text-slate-500">{periodTotals.prev > 0 ? 'Change vs previous' : 'No previous data'}</div>
            </div>
          </div>

          <div className="p-5">
            <SalesBarChart data={salesOverview} color="#f59e0b" />
          </div>
        </Card>

        <Card>
          <div className="border-b border-card-border px-5 py-4">
            <h3 className="text-base font-semibold text-text-main">Category Breakdown</h3>
            <p className="text-xs text-text-muted">Sales by category</p>
          </div>
          <div className="p-5">
            <DonutChart data={categoryBreakdown} colors={donutColors} />
            <div className="mt-4 space-y-2 text-sm">
              {categoryBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: donutColors[index] }} />
                  <span className="text-text-muted">{item.name}</span>
                  <span className="ml-auto font-semibold text-text-main">{item.value}%</span>
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
