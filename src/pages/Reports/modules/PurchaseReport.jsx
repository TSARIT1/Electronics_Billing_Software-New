import React, { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { listPurchases } from "../../../services/purchases";
import toast from "react-hot-toast";

const PurchaseReport = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await listPurchases();
        setPurchases(data);
      } catch (error) {
        toast.error("Failed to fetch purchase data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const totalSpent = purchases.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = purchases.length;

  const formatCurrency = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/reports")} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Purchase Report</h1>
          <p className="text-slate-400 text-sm mt-1">Supplier orders and capital spending analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <ShoppingCart size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{formatCurrency(totalSpent)}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Capital Spent</p>
        </Card>
        
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
            <Truck size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{totalOrders}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Orders Placed</p>
        </Card>
      </div>

      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Purchase Orders</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-8 text-center text-slate-400 text-sm">Loading orders...</p>
          ) : purchases.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-sm">No purchases found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="p-4 pl-6">PO Number</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {purchases.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-indigo-400">{order.id ? `PO-${order.id}` : 'PO-Unknown'}</td>
                    <td className="p-4 text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-white font-medium">{order.supplier || "Unknown Supplier"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'RECEIVED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {order.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right font-bold text-amber-500">{formatCurrency(order.total)}</td>
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

export default PurchaseReport;
