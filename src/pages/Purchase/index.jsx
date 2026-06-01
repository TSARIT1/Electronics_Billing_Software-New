import { useEffect, useMemo, useState } from "react";
import { PackageCheck, PackageSearch, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import PurchaseTable from "../../components/tables/PurchaseTable";
import { listPurchases } from "../../services/purchases";

const Purchase = () => {
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const icons = [ShoppingBag, PackageCheck, PackageSearch];

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const loadPurchases = async (query = "") => {
    setIsLoading(true);
    try {
      const data = await listPurchases(query);
      setPurchases(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases(search);
  }, [search]);

  const purchaseStats = useMemo(() => {
    const totalOrders = purchases.length;
    const deliveredValue = purchases
      .filter((order) => order.status === "Delivered")
      .reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingProcessing = purchases.filter(
      (order) => order.status === "Pending" || order.status === "Processing"
    ).length;

    return [
      { title: "Total Orders", value: String(totalOrders) },
      { title: "Delivered Value", value: formatCurrency(deliveredValue) },
      { title: "Pending/Processing", value: String(pendingProcessing) },
    ];
  }, [purchases]);

  const purchaseOrders = useMemo(
    () =>
      purchases.map((order) => ({
        id: `PO-${order.id}`,
        supplier: order.supplier || "-",
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
        items: order.items?.length || 0,
        amount: formatCurrency(order.total),
        status: order.status || "Pending",
      })),
    [purchases]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {purchaseStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={icons[index]}
            accent={index === 1 ? "success" : "primary"}
          />
        ))}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-main">
              Purchase Orders
            </h3>
            <p className="text-xs text-text-muted">
              Supplier order management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search purchase orders"
            />
            <Button onClick={() => loadPurchases(search)}>Refresh</Button>
          </div>
        </div>

        <div className="mt-5">
          {isLoading && <p className="text-sm text-text-muted">Loading purchases...</p>}
          <PurchaseTable data={purchaseOrders} />
        </div>
      </Card>
    </div>
  );
};

export default Purchase;
