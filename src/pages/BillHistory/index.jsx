import { useEffect, useMemo, useState } from "react";
import { FileDown, ReceiptIndianRupee, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import BillHistoryTable from "../../components/tables/BillHistoryTable";
import InvoicePreview from "../../components/invoice/InvoicePreview";
import { listInvoices } from "../../services/invoices";
import { listProducts } from "../../services/products";

const BillHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        const [invoices, products] = await Promise.all([listInvoices(), listProducts().catch(() => [])]);
        const mapped = invoices.map((invoice) => ({
          id: invoice.invoiceNo || `INV-${invoice.id}`,
          customer: invoice.purchaser || "Walk-in Customer",
          date: invoice.date || (invoice.createdAt
            ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"),
          items: invoice.items?.length || 0,
          total: `₹${Number(invoice.grandTotal || invoice.total || 0).toLocaleString("en-IN")}`,
          payment: invoice.paymentMode || "Cash",
          status: "Paid",
          invoiceNo: invoice.invoiceNo || `INV-${invoice.id}`,
          phone: invoice.phone || "",
          address: invoice.address || "",
          gstin: invoice.gstin || "",
          stateCode: invoice.stateCode || "",
          transporter: invoice.transporter || "",
          vehicleNo: invoice.vehicleNo || "",
          mobile: invoice.mobile || "",
          spotDiscount: invoice.spotDiscount || 0,
          splSeaDiscount: invoice.splSeaDiscount || 0,
          otherDiscount: invoice.otherDiscount || 0,
          cgst: invoice.cgst || 0,
          sgst: invoice.sgst || 0,
          igst: invoice.igst || 0,
          roundOff: invoice.roundOff || 0,
          grandTotal: invoice.grandTotal || 0,
          taxableAmount: invoice.total || 0,
          itemDetails: (invoice.items || []).map((item) => {
            const p = products.find((prod) => prod.id === item.productId);
            return {
              name: item.name,
              qty: item.quantity,
              units: p?.units || "Pcs",
              price: item.price,
              hsnCode: p?.hsn || "8517",
              gst: (invoice.cgst || 0) + (invoice.sgst || 0) + (invoice.igst || 0),
            };
          }),
        }));
        setHistoryData(mapped);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const filteredHistory = useMemo(() => {
    if (!search.trim()) {
      return historyData;
    }
    const query = search.toLowerCase();
    return historyData.filter(
      (row) =>
        row.id.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query) ||
        row.date.toLowerCase().includes(query)
    );
  }, [historyData, search]);

  const totalRevenue = useMemo(() => {
    return `₹${filteredHistory
      .reduce((sum, row) => {
        const numeric = Number(String(row.total).replace(/[^0-9]/g, "")) || 0;
        return sum + numeric;
      }, 0)
      .toLocaleString("en-IN")}`;
  }, [filteredHistory]);

  const stats = [
    { title: "Total Bills", value: String(filteredHistory.length) },
    { title: "Revenue", value: totalRevenue },
    {
      title: "Returns",
      value: String(filteredHistory.filter((row) => row.status === "Returned").length),
    },
  ];

  const exportAllToCSV = () => {
    if (filteredHistory.length === 0) {
      toast.error("No invoices to export");
      return;
    }
    const headers = "Bill ID,Customer,Date,Items,Total,Payment Mode,Status\n";
    const rows = filteredHistory
      .map(
        (row) =>
          `"${row.id}","${row.customer}","${row.date}","${row.items}","${row.total}","${row.payment}","${row.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `electroshop_invoices_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoices exported successfully");
  };

  const exportSingleBill = (row) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(row, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `invoice_${row.id}.json`);
    a.click();
    toast.success(`Invoice ${row.id} details exported as JSON`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title={stats[0].title}
          value={stats[0].value}
          icon={ReceiptIndianRupee}
        />
        <StatCard
          title={stats[1].title}
          value={stats[1].value}
          icon={FileDown}
          accent="success"
        />
        <StatCard
          title={stats[2].title}
          value={stats[2].value}
          icon={RefreshCw}
          accent="warning"
        />
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-main">
              Bill History
            </h3>
            <p className="text-xs text-text-muted">
              Recent invoices and payment status
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bills"
            />
            <Button variant="ghost" onClick={exportAllToCSV}>Export</Button>
          </div>
        </div>

        <div className="mt-5">
          {isLoading && <p className="text-sm text-text-muted">Loading invoices...</p>}
          <BillHistoryTable
            data={filteredHistory}
            onView={(row) => setViewingBill(row)}
            onExport={exportSingleBill}
          />
        </div>
      </Card>

      <AnimatePresence>
        {viewingBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setViewingBill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-[32px] bg-[#020717] border border-amber-500/20 p-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewingBill(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition backdrop-blur-md text-xs font-semibold px-4 py-2"
              >
                Close
              </button>
              <div className="mt-8 max-h-[75vh] overflow-y-auto pr-1">
                <InvoicePreview
                  details={{
                    invoiceNo: viewingBill.invoiceNo || viewingBill.id,
                    date: viewingBill.date,
                    customer: viewingBill.customer,
                    phone: viewingBill.phone || "",
                    address: viewingBill.address || "",
                    gstin: viewingBill.gstin || "",
                    paymentMode: viewingBill.payment || "Cash",
                    stateCode: viewingBill.stateCode || "",
                    transporter: viewingBill.transporter || "",
                    vehicleNo: viewingBill.vehicleNo || "",
                    mobile: viewingBill.mobile || "",
                    spotDiscount: viewingBill.spotDiscount || 0,
                    splSeaDiscount: viewingBill.splSeaDiscount || 0,
                    otherDiscount: viewingBill.otherDiscount || 0,
                    cgst: viewingBill.cgst || 0,
                    sgst: viewingBill.sgst || 0,
                    igst: viewingBill.igst || 0,
                    roundOff: viewingBill.roundOff || 0,
                    grandTotal: viewingBill.grandTotal || 0,
                    taxableAmount: viewingBill.taxableAmount || 0,
                  }}
                  items={viewingBill.itemDetails || []}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillHistory;
