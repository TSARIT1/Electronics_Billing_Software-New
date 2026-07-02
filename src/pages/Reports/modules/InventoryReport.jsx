import React, { useEffect, useState } from "react";
import { ArrowLeft, Package, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { listProducts } from "../../../services/products";
import toast from "react-hot-toast";

const InventoryReport = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await listProducts();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to fetch inventory data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalValuation = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.costPrice || 0)), 0);
  const lowStockCount = products.filter(p => (p.quantity || 0) <= (p.minStock || 5)).length;

  const formatCurrency = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/reports")} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory Report</h1>
          <p className="text-slate-400 text-sm mt-1">Stock levels, valuation, and low stock warnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
            <Package size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{formatCurrency(totalValuation)}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Stock Valuation</p>
        </Card>
        
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{lowStockCount}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
        </Card>
      </div>

      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Stock Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-8 text-center text-slate-400 text-sm">Loading inventory...</p>
          ) : products.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-sm">No products found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="p-4 pl-6">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Current Stock</th>
                  <th className="p-4 text-right">Cost Price</th>
                  <th className="p-4 text-right pr-6">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-white">{p.name}</td>
                    <td className="p-4 text-slate-400">{p.category}</td>
                    <td className="p-4 text-center font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        (p.quantity || 0) <= (p.minStock || 5) ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                      }`}>
                        {p.quantity || 0}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-300">{formatCurrency(p.costPrice)}</td>
                    <td className="p-4 pr-6 text-right font-bold text-indigo-400">{formatCurrency((p.quantity || 0) * (p.costPrice || 0))}</td>
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

export default InventoryReport;
