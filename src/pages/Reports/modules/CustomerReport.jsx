import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { listInvoices } from "../../../services/invoices";
import toast from "react-hot-toast";

const CustomerReport = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await listInvoices();
        setInvoices(data);
      } catch (error) {
        toast.error("Failed to fetch customer data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const customerStats = useMemo(() => {
    const stats = {};
    invoices.forEach(inv => {
      const name = inv.purchaser || "Walk-in";
      const phone = inv.phone || "N/A";
      const key = `${name}-${phone}`;
      
      if (!stats[key]) {
        stats[key] = {
          name,
          phone,
          totalSpent: 0,
          visits: 0,
          lastVisit: inv.createdAt
        };
      }
      
      stats[key].totalSpent += (inv.grandTotal || inv.total || 0);
      stats[key].visits += 1;
      if (new Date(inv.createdAt) > new Date(stats[key].lastVisit)) {
        stats[key].lastVisit = inv.createdAt;
      }
    });

    return Object.values(stats).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [invoices]);

  const totalCustomers = customerStats.length;
  const repeatCustomers = customerStats.filter(c => c.visits > 1).length;

  const formatCurrency = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/reports")} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Report</h1>
          <p className="text-slate-400 text-sm mt-1">Top spenders and customer retention analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{totalCustomers}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Unique Customers</p>
        </Card>
        
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
            <Trophy size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{repeatCustomers}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Repeat Customers</p>
        </Card>
      </div>

      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Top Customers</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-8 text-center text-slate-400 text-sm">Loading customers...</p>
          ) : customerStats.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-sm">No customers found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="p-4 pl-6 w-16">Rank</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">Visits</th>
                  <th className="p-4">Last Visit</th>
                  <th className="p-4 text-right pr-6">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {customerStats.map((c, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-amber-500 text-black' :
                        index === 1 ? 'bg-slate-300 text-black' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">{c.name}</td>
                    <td className="p-4 text-slate-400">{c.phone}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold">
                        {c.visits}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{new Date(c.lastVisit).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right font-bold text-emerald-400">{formatCurrency(c.totalSpent)}</td>
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

export default CustomerReport;
