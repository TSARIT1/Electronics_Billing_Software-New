import { useEffect, useMemo, useState } from "react";
import { PackagePlus } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InventoryTable from "../../components/tables/InventoryTable";
import AddProductModal from "../../components/modals/AddProductModal";
import { createProduct, listProducts } from "../../services/products";

const tabs = ["All", "Low Stock", "Out of Stock"];

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const loadProducts = async (searchQuery = "") => {
    setIsLoading(true);
    try {
      const data = await listProducts(searchQuery);
      setProducts(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(search);
  }, [search]);

  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const totalStockUnits = products.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const inventoryValue = products.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.costPrice || 0),
      0
    );
    const lowStockItems = products.filter(
      (item) => item.status === "Low" || item.status === "Out of Stock"
    ).length;

    return [
      { title: "Total Products", value: String(totalProducts) },
      { title: "Total Stock Units", value: totalStockUnits.toLocaleString("en-IN") },
      { title: "Inventory Value", value: formatCurrency(inventoryValue) },
      { title: "Low Stock Items", value: String(lowStockItems) },
    ];
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .map((item) => ({
        ...item,
        cost: formatCurrency(item.costPrice),
        stock: item.quantity || 0,
      }))
      .filter((item) => {
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Low Stock" && item.status === "Low") ||
        (activeTab === "Out of Stock" && item.status === "Out of Stock");
      return matchesTab;
    });
  }, [products, activeTab]);

  const handleSave = async (values) => {
    try {
      await createProduct({
        name: values.name,
        brand: values.brand,
        category: values.category,
        sku: values.sku,
        hsn: values.hsn,
        description: values.description || "",
        costPrice: Number(values.cost) || 0,
        price: Number(values.price) || 0,
        quantity: Number(values.stock) || 0,
        minStock: Number(values.minStock) || 5,
      });
      toast.success("Product saved successfully");
      await loadProducts(search);
    } catch (error) {
      toast.error(error.message);
    }
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
          {isLoading && <p className="text-sm text-text-muted">Loading inventory...</p>}
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
