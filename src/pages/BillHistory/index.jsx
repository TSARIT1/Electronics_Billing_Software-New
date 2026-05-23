import { useEffect, useMemo, useState } from "react";
import { FileDown, ReceiptIndianRupee, RefreshCw } from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import BillHistoryTable from "../../components/tables/BillHistoryTable";
import { billHistory, billHistoryStats } from "../../data/mockData";

const BillHistory = () => {
  const [historyData, setHistoryData] = useState(billHistory);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("billHistory")) || [];
    if (storedHistory.length > 0) {
      setHistoryData([...storedHistory, ...billHistory]);
    }
  }, []);

  const totalRevenue = useMemo(() => {
    return `₹${historyData
      .reduce((sum, row) => {
        const numeric = Number(String(row.total).replace(/[^0-9]/g, "")) || 0;
        return sum + numeric;
      }, 0)
      .toLocaleString("en-IN")}`;
  }, [historyData]);

  const stats = [
    { title: "Total Bills", value: String(historyData.length) },
    { title: "Revenue", value: totalRevenue },
    { title: billHistoryStats[2].title, value: billHistoryStats[2].value },
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
          <SearchInput placeholder="Search bills" />
          <Button variant="ghost">Export</Button>
        </div>
      </div>

      <div className="mt-5">
        <BillHistoryTable data={historyData} />
      </div>
    </Card>
  </div>
  );
};

export default BillHistory;
