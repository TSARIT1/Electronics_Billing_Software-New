import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { listInvoices } from "../../../services/invoices";
import toast from "react-hot-toast";

const GSTReport = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await listInvoices();
        setInvoices(data);
      } catch (error) {
        toast.error("Failed to fetch GST data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const totalTax = invoices.reduce((sum, inv) => sum + ((inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0)), 0);
  const totalTaxableValue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  const formatCurrency = (val) => `₹${Number(val).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/reports")} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GST Report</h1>
          <p className="text-slate-400 text-sm mt-1">Tax collection summary and compliance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <Landmark size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{formatCurrency(totalTax)}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Tax Collected</p>
        </Card>
        
        <Card className="bg-[#0f172a] border-card-border/20 shadow-lg p-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{formatCurrency(totalTaxableValue)}</h3>
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Taxable Value</p>
        </Card>
      </div>

      <Card className="p-0 bg-[#0f172a] border-card-border/20 shadow-lg">
        <div className="border-b border-card-border/20 px-6 py-5">
          <h3 className="text-lg font-bold text-white">Tax Liability Register</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-8 text-center text-slate-400 text-sm">Loading tax records...</p>
          ) : invoices.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-sm">No records found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="p-4 pl-6">Invoice No</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Taxable Value</th>
                  <th className="p-4 text-right">CGST (9%)</th>
                  <th className="p-4 text-right">SGST (9%)</th>
                  <th className="p-4 text-right pr-6">Total Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {invoices.map((inv) => {
                  const tax = (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0);
                  const cgst = inv.cgst || 0;
                  const sgst = inv.sgst || 0;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-indigo-400">{inv.invoiceNo || `INV-${inv.id}`}</td>
                      <td className="p-4 text-slate-300">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right text-slate-300">{formatCurrency(inv.total || 0)}</td>
                      <td className="p-4 text-right text-amber-400">{formatCurrency(cgst)}</td>
                      <td className="p-4 text-right text-amber-400">{formatCurrency(sgst)}</td>
                      <td className="p-4 pr-6 text-right font-bold text-emerald-400">{formatCurrency(tax)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GSTReport;
