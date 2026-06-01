import { useEffect, useMemo, useState } from "react";
import { FileDown, ReceiptIndianRupee, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import BillHistoryTable from "../../components/tables/BillHistoryTable";
import { listInvoices } from "../../services/invoices";

const BillHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        const invoices = await listInvoices();
        const mapped = invoices.map((invoice) => ({
          id: `INV-${invoice.id}`,
          customer: invoice.items?.[0]?.name || "Walk-in Customer",
          date: invoice.createdAt
            ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
          items: invoice.items?.length || 0,
          total: `₹${Number(invoice.total || 0).toLocaleString("en-IN")}`,
          payment: "Cash",
          status: "Paid",
          invoiceNo: `INV-${invoice.id}`,
          itemDetails: (invoice.items || []).map((item) => ({
            name: item.name,
            qty: item.quantity,
            units: "Pcs",
            price: item.price,
            hsnCode: "8517",
          })),
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
          <Button variant="ghost">Export</Button>
        </div>
      </div>

      <div className="mt-5">
        {isLoading && <p className="text-sm text-text-muted">Loading invoices...</p>}
        <BillHistoryTable data={filteredHistory} />
      </div>
    </Card>
  </div>
  );
};

export default BillHistory;
