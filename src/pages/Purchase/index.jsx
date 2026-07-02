import { useEffect, useMemo, useState } from "react";
import { PackageCheck, PackageSearch, ShoppingBag, Plus, ShoppingCart, CheckCircle, Clock, IndianRupee, Users } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import PurchaseTable from "../../components/tables/PurchaseTable";
import SupplierTable from "../../components/tables/SupplierTable";
import PurchaseOrderCreateModal from "../../components/modals/PurchaseOrderCreateModal";
import PurchaseOrderModal from "../../components/modals/PurchaseOrderModal";
import AddSupplierModal from "../../components/modals/AddSupplierModal";
import { listPurchases, createPurchase, updatePurchase, deletePurchase } from "../../services/purchases";
import { listProducts } from "../../services/products";
import { listSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/suppliers";

const Purchase = () => {
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recordTab, setRecordTab] = useState("All");

  // Purchase Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  // Supplier Modal states
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const loadData = async (query = "") => {
    setIsLoading(true);
    try {
      const [purchasesData, suppliersData, productsData] = await Promise.all([
        listPurchases(query),
        listSuppliers(),
        listProducts()
      ]);
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(search);
  }, [search]);

  const purchaseStats = useMemo(() => {
    const totalOrders = purchases.length;
    const receivedCount = purchases.filter((order) => order.status === "Delivered").length;
    const pendingCount = purchases.filter((order) => order.status === "Pending" || order.status === "Processing").length;
    const totalSpend = purchases.reduce((sum, order) => sum + (order.total || 0), 0);

    return [
      { title: "Total Orders", value: String(totalOrders), icon: ShoppingCart, bg: "bg-indigo-500/10", text: "text-indigo-500" },
      { title: "Received", value: String(receivedCount), icon: CheckCircle, bg: "bg-emerald-500/10", text: "text-emerald-500" },
      { title: "Pending", value: String(pendingCount), icon: Clock, bg: "bg-amber-500/10", text: "text-amber-500" },
      { title: "Total Spend", value: formatCurrency(totalSpend), icon: IndianRupee, bg: "bg-rose-500/10", text: "text-rose-500" },
    ];
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((order) => {
      if (recordTab === "All") return true;
      if (recordTab === "Received") return order.status === "Delivered";
      if (recordTab === "Pending") return order.status === "Pending" || order.status === "Processing";
      return true;
    }).map((order) => ({
        id: `PO-${order.id}`,
        rawId: order.id,
        supplier: order.supplier || "-",
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
        itemsCount: order.items?.length || 0,
        items: order.items || [],
        amount: formatCurrency(order.total),
        status: order.status || "Pending",
      }));
  }, [purchases, recordTab]);

  const handleCreateSave = async (payload) => {
    try {
      await createPurchase(payload);
      toast.success("Purchase order created successfully");
      setIsCreateOpen(false);
      loadData(search);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateSave = async (id, payload) => {
    try {
      await updatePurchase(id, payload);
      toast.success("Purchase order updated");
      setIsDetailsOpen(false);
      loadData(search);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePurchase(id);
      toast.success("Purchase order deleted");
      setIsDetailsOpen(false);
      loadData(search);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveSupplier = async (data) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, data);
        toast.success("Supplier updated successfully");
      } else {
        await createSupplier(data);
        toast.success("Supplier added successfully");
      }
      setIsSupplierModalOpen(false);
      const updatedSuppliers = await listSuppliers();
      setSuppliers(updatedSuppliers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      toast.success("Supplier deleted");
      const updatedSuppliers = await listSuppliers();
      setSuppliers(updatedSuppliers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Purchase</h1>
          <p className="text-slate-400 text-sm mt-1">Supplier orders & purchase records</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border-none px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} className="mr-2 inline" /> New Purchase Order
        </Button>
      </div>

      <Card className="p-0 overflow-hidden bg-[#0f172a] border border-card-border/20 shadow-lg">
        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-card-border/20 gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-indigo-400" /> Suppliers ({suppliers.length})
          </h2>
          <Button
            variant="outline"
            onClick={() => {
              setEditingSupplier(null);
              setIsSupplierModalOpen(true);
            }}
            className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 font-semibold"
          >
            <Plus size={16} className="mr-2 inline" /> New Supplier
          </Button>
        </div>
        <SupplierTable
          data={suppliers}
          onEdit={(supplier) => {
            setEditingSupplier(supplier);
            setIsSupplierModalOpen(true);
          }}
          onDelete={handleDeleteSupplier}
          onAddSupplier={() => {
            setEditingSupplier(null);
            setIsSupplierModalOpen(true);
          }}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {purchaseStats.map((stat, idx) => (
          <div key={idx} className="bg-[#0f172a] border border-card-border/20 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 left-0 w-full h-1 ${stat.bg.replace('/10', '')} opacity-80`} />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.text}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <Card className="p-5 bg-[#0f172a] border border-card-border/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 whitespace-nowrap">
              <ShoppingBag size={20} className="text-indigo-400" /> Purchase Records
            </h2>
            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800">
              {["All", "Received", "Pending"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    recordTab === tab
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                  onClick={() => setRecordTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-64">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-sm text-text-muted py-8 text-center">Loading purchases...</p>
          ) : (
            <PurchaseTable
              data={filteredPurchases}
              onView={(order) => {
                setSelectedOrder(order);
                setModalMode("view");
                setIsDetailsOpen(true);
              }}
              onEdit={(order) => {
                setSelectedOrder(order);
                setModalMode("edit");
                setIsDetailsOpen(true);
              }}
              onDelete={(id) => handleDelete(id)}
            />
          )}
        </div>
      </Card>

      <PurchaseOrderCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateSave}
        products={products}
      />

      <PurchaseOrderModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        mode={modalMode}
        onSave={(updatedPayload) => handleUpdateSave(selectedOrder.rawId, updatedPayload)}
        products={products}
      />

      <AddSupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
      />
    </div>
  );
};

export default Purchase;
