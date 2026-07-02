import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { listInvoices } from "../../../services/invoices";
import { listPurchases } from "../../../services/purchases";
import { listProducts } from "../../../services/products";
import toast from "react-hot-toast";

const ProfitLossReport = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ revenue: 0, cogs: 0, expenses: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [invoices, purchases, products] = await Promise.all([
          listInvoices(),
          listPurchases(),
          listProducts()
        ]);
        
        const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
        const totalExpenses = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
        
        // Calculate true COGS (Cost of Goods Sold) based on products sold
        let cogs = 0;
        invoices.forEach(inv => {
          if (inv.items) {
            inv.items.forEach(item => {
              const product = products.find(p => p.id === item.productId);
              const cost = product ? product.costPrice : 0;
              cogs += cost * (item.quantity || 0);
            });
          }
        });

        setData({ revenue: totalRevenue, cogs, expenses: totalExpenses });
      } catch (error) {
        toast.error("Failed to fetch P&L data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const netProfit = data.revenue - data.expenses;
  const grossProfit = data.revenue - data.cogs;
  
  const formatCurrency = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/reports")} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Profit & Loss</h1>
          <p className="text-slate-400 text-sm mt-1">Detailed revenue vs expenses breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{formatCurrency(data.revenue)}</h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
        </Card>
        
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 opacity-80" />
          <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{formatCurrency(data.expenses)}</h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</p>
        </Card>

        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className={`absolute top-0 left-0 w-full h-1 ${netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500'} opacity-80`} />
          <h3 className={`text-2xl font-bold tracking-tight mb-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(netProfit)}
          </h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit</p>
        </Card>
      </div>

      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Income Statement</h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <p className="text-center text-slate-400 text-sm py-4">Calculating...</p>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Gross Revenue</span>
                <span className="font-semibold text-white">{formatCurrency(data.revenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-300">Cost of Goods Sold (COGS)</span>
                <span className="font-semibold text-rose-400">-{formatCurrency(data.cogs)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-slate-900/50 px-4 rounded-lg">
                <span className="font-bold text-white">Gross Profit</span>
                <span className="font-bold text-emerald-400">{formatCurrency(grossProfit)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800 mt-6">
                <span className="text-slate-300">Total Purchase Capital (Inventory Restock)</span>
                <span className="font-semibold text-rose-400">-{formatCurrency(data.expenses)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-indigo-500/10 px-4 rounded-lg border border-indigo-500/20 mt-4">
                <span className="font-bold text-white text-lg">Net Cash Flow</span>
                <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfitLossReport;
