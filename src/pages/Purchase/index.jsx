import { PackageCheck, PackageSearch, ShoppingBag } from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PurchaseTable from "../../components/tables/PurchaseTable";
import { purchaseOrders, purchaseStats } from "../../data/mockData";

const Purchase = () => {
  const icons = [ShoppingBag, PackageCheck, PackageSearch];

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
          <Button>+ Create Purchase Order</Button>
        </div>

        <div className="mt-5">
          <PurchaseTable data={purchaseOrders} />
        </div>
      </Card>
    </div>
  );
};

export default Purchase;
