import { useEffect, useMemo, useState } from "react";
import { PackagePlus } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InventoryTable from "../../components/tables/InventoryTable";
import AddProductModal from "../../components/modals/AddProductModal";
import { createProduct, listProducts, updateProduct, deleteProduct } from "../../services/products";
import { createNotification } from "../../services/notifications";

const tabs = ["All", "Low Stock", "Out of Stock"];

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
      const payload = {
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
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success("Product updated successfully");
        createNotification({
          title: "Product Updated",
          message: `${values.name} details were updated in inventory.`,
          type: "info"
        }).catch(console.error);
      } else {
        await createProduct(payload);
        toast.success("Product saved successfully");
        createNotification({
          title: "New Product Added",
          message: `${values.name} was successfully added to inventory.`,
          type: "success"
        }).catch(console.error);
      }

      if (payload.quantity <= payload.minStock) {
        createNotification({
          title: "Low Stock Alert",
          message: `${values.name} is running low on stock (${payload.quantity} remaining).`,
          type: "warning"
        }).catch(console.error);
      }

      await loadProducts(search);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      createNotification({
        title: "Product Deleted",
        message: `${product ? product.name : 'A product'} was removed from inventory.`,
        type: "danger"
      }).catch(console.error);
      await loadProducts(search);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
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
                className={`rounded-full px-5 py-2 text-xs font-bold transition duration-300 ${
                  activeTab === tab
                    ? "bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30"
                    : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800"
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
            <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
              <PackagePlus size={16} />
              Add Product
            </Button>
          </div>
        </div>

        <div className="mt-5">
          {isLoading && <p className="text-sm text-text-muted">Loading inventory...</p>}
          <InventoryTable data={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
};

export default Inventory;
