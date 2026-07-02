import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ShoppingCart, PiggyBank, ShoppingBag, PieChart as PieChartIcon, PackageSearch, PackageCheck, BarChart4, FileText, Users, Download } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import RevenueBarChart from "../../components/charts/RevenueBarChart";
import DonutChart from "../../components/charts/DonutChart";
import { listInvoices } from "../../services/invoices";
import { listPurchases } from "../../services/purchases";
import { listProducts } from "../../services/products";

const donutColors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"]; // Indigo, Green, Amber, Red

const Reports = () => {
  const [invoices, setInvoices] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        const [invoiceData, purchaseData, productData] = await Promise.all([
          listInvoices(),
          listPurchases(),
          listProducts(),
        ]);
        setInvoices(invoiceData);
        setPurchases(purchaseData);
        setProducts(productData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReportsData();
  }, []);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const reportsStats = useMemo(() => {
    const revenue = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const purchaseTotal = purchases.reduce((sum, order) => sum + (order.total || 0), 0);
    const profit = revenue - purchaseTotal;
    const avgOrder = invoices.length ? revenue / invoices.length : 0;

    return [
      { title: "Total Revenue", value: formatCurrency(revenue), icon: TrendingUp, bg: "bg-indigo-500/10", text: "text-indigo-500" },
      { title: "Total Purchases", value: formatCurrency(purchaseTotal), icon: ShoppingCart, bg: "bg-amber-500/10", text: "text-amber-500" },
      { title: "Estimated Profit", value: formatCurrency(profit), icon: PiggyBank, bg: "bg-emerald-500/10", text: "text-emerald-500" },
      { title: "Avg. Order Value", value: formatCurrency(avgOrder), icon: ShoppingBag, bg: "bg-rose-500/10", text: "text-rose-500" },
    ];
  }, [invoices, purchases]);

  const revenueVsPurchases = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueByMonth = Array(12).fill(0);
    const purchaseByMonth = Array(12).fill(0);

    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt);
      revenueByMonth[date.getMonth()] += invoice.grandTotal || invoice.total || 0;
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
    const emi = Math.max(invoiceCount - upi - card - cash, 0);

    return [
      { name: "UPI", value: Math.round((upi / invoiceCount) * 100) },
      { name: "Card", value: Math.round((card / invoiceCount) * 100) },
      { name: "Cash", value: Math.round((cash / invoiceCount) * 100) },
      { name: "EMI", value: Math.round((emi / invoiceCount) * 100) },
    ];
  }, [invoices]);

  const topSellingProducts = useMemo(() => {
    const productStats = {};

    invoices.forEach(invoice => {
      if (!invoice.items) return;
      invoice.items.forEach(item => {
        if (!productStats[item.productId]) {
          const product = products.find(p => p.id === item.productId);
          productStats[item.productId] = {
            id: item.productId,
            name: item.name,
            category: product ? product.category : "Uncategorized",
            costPrice: product ? product.costPrice : 0,
            unitsSold: 0,
            revenue: 0,
          };
        }
        productStats[item.productId].unitsSold += item.quantity || 0;
        productStats[item.productId].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });

    const sortedProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    return sortedProducts.map((p, index) => {
      const totalCost = p.unitsSold * p.costPrice;
      const profit = p.revenue - totalCost;
      let profitMargin = p.revenue > 0 ? (profit / p.revenue) * 100 : 0;
      if (profitMargin < 0) profitMargin = 0; // fallback

      return {
        ...p,
        rank: index + 1,
        profitMargin: Math.round(profitMargin),
      };
    });
  }, [invoices, products]);

  const navigate = useNavigate();

  const quickReports = [
    { title: "Sales Report", desc: "Detailed sales analysis", icon: TrendingUp, color: "text-indigo-400", path: "/reports/sales" },
    { title: "Inventory Report", desc: "Stock levels & valuation", icon: PackageSearch, color: "text-indigo-400", path: "/reports/inventory" },
    { title: "Purchase Report", desc: "Supplier orders & spending", icon: ShoppingCart, color: "text-indigo-400", path: "/reports/purchase" },
    { title: "Profit & Loss", desc: "Revenue vs expenses", icon: PiggyBank, color: "text-indigo-400", path: "/reports/profit-loss" },
    { title: "GST Report", desc: "Tax collection summary", icon: FileText, color: "text-indigo-400", path: "/reports/gst" },
    { title: "Customer Report", desc: "Top customers & trends", icon: Users, color: "text-indigo-400", path: "/reports/customer" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Analytics & Insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportsStats.map((stat, idx) => (
          <div key={idx} className="bg-[#0f172a] border border-card-border/20 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col hover:border-indigo-500/30 transition-colors">
            <div className={`absolute top-0 left-0 w-full h-1 ${stat.bg.replace('/10', '')} opacity-80`} />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.text}`}>
              <stat.icon size={20} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{stat.value}</h3>
            <p className="text-xs font-semibold text-slate-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
          <div className="border-b border-card-border/20 px-5 py-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Revenue vs Purchases
            </h3>
          </div>
          <div className="p-5">
            <RevenueBarChart data={revenueVsPurchases} />
          </div>
        </Card>

        <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
          <div className="border-b border-card-border/20 px-5 py-4 flex items-center gap-2">
            <PieChartIcon size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Payment Methods
            </h3>
          </div>
          <div className="p-5">
            <DonutChart data={paymentMethods} colors={donutColors} />
            <div className="mt-6 flex justify-center gap-4 text-xs font-semibold">
              {paymentMethods.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: donutColors[index] }}
                  />
                  <span className="text-slate-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-5 py-4 flex items-center gap-2">
          <BarChart4 size={18} className="text-amber-500" />
          <h3 className="text-base font-bold text-white">Quick Reports</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickReports.map((report, idx) => (
            <button key={idx} onClick={() => navigate(report.path)} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:bg-slate-800 hover:border-indigo-500/50 transition-all text-center flex flex-col items-center justify-center gap-2 group">
              <report.icon size={28} className={`${report.color} group-hover:scale-110 transition-transform`} />
              <div>
                <h4 className="text-sm font-bold text-white">{report.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{report.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Top Selling Products */}
      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PackageCheck size={18} className="text-amber-500" />
            <h3 className="text-base font-bold text-white">Top Selling Products</h3>
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs py-1.5">
            <Download size={14} className="mr-2 inline" /> Export Report
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-sm text-slate-400 p-8 text-center">Loading reports data...</p>
          ) : topSellingProducts.length === 0 ? (
            <p className="text-sm text-slate-400 p-8 text-center">No sales data available to calculate top products.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="p-4 rounded-tl-lg text-center w-16">RANK</th>
                  <th className="p-4">PRODUCT</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4 text-center">UNITS SOLD</th>
                  <th className="p-4 text-right">REVENUE</th>
                  <th className="p-4 w-40">PROFIT MARGIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {topSellingProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        product.rank === 1 ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                        product.rank === 2 ? 'bg-slate-300 text-black shadow-[0_0_10px_rgba(203,213,225,0.5)]' :
                        product.rank === 3 ? 'bg-amber-700 text-white shadow-[0_0_10px_rgba(180,83,9,0.5)]' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {product.rank}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">{product.name}</td>
                    <td className="p-4 text-slate-400">{product.category}</td>
                    <td className="p-4 text-center font-medium text-slate-300">{product.unitsSold}</td>
                    <td className="p-4 text-right font-bold text-indigo-400">{formatCurrency(product.revenue)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.min(product.profitMargin, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-emerald-500 w-8 text-right">{product.profitMargin}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
