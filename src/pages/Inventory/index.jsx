import { useMemo, useState } from "react";
import { PackagePlus } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InventoryTable from "../../components/tables/InventoryTable";
import AddProductModal from "../../components/modals/AddProductModal";
import { inventoryProducts, inventoryStats } from "../../data/mockData";

const tabs = ["All", "Low Stock", "Out of Stock"];

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return inventoryProducts.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Low Stock" && item.status === "Low") ||
        (activeTab === "Out of Stock" && item.status === "Critical");
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab]);

  const handleSave = () => {
    toast.success("Product saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {inventoryStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-soft"
                    : "bg-slate-100 text-text-muted"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product or SKU"
            />
            <Button onClick={() => setIsModalOpen(true)}>
              <PackagePlus size={16} />
              Add Product
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <InventoryTable data={filtered} />
        </div>
      </Card>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Inventory;
