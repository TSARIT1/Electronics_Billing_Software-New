import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Lock, Trash2, Store, Search, Download, X, MapPin, Calendar, Users, Briefcase, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import { getAllStores, toggleStoreStatus, deleteStore } from "../../services/superAdmin";

const SAStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(null);

  const fetchStores = () => {
    setLoading(true);
    getAllStores()
      .then(setStores)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.managerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.managerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = "Store Name,Manager,Email,Phone,Address,Referred By,Plan,Users,Status\n";
    const rows = filtered
      .map(
        (s) =>
          `"${s.name}","${s.managerName}","${s.managerEmail}","${s.managerPhone}","${s.address || ""}","${s.referredBy || ""}","${s.planName}","${s.userCount}","${s.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "electroshop_stores.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAction = async (action, storeId, storeObj) => {
    try {
      if (action === 'view') {
        setViewModal(storeObj);
      } else if (action === 'freeze') {
        if (!window.confirm("Are you sure you want to toggle the status of this store?")) return;
        const res = await toggleStoreStatus(storeId);
        toast.success(res.message);
        fetchStores();
      } else if (action === 'delete') {
        if (!window.confirm("WARNING: This will permanently delete the store and ALL its users. Are you absolutely sure?")) return;
        await deleteStore(storeId);
        toast.success("Store deleted successfully");
        fetchStores();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Registered Stores
            </h1>
            <p className="mt-1 text-base text-white/70">
              Total: {stores.length} ElectroShop Stores
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search stores, managers, emails..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-amber-500/15 bg-slate-950/90 pl-11 pr-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-lg transition focus:border-amber-400/40 focus:shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:border-amber-500/30"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-[28px] border border-amber-500/15 bg-slate-950/90 shadow-2xl backdrop-blur-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-500/10 bg-slate-900/50 text-left">
                <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Store Name
                </th>
                <th className="px-4 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Contact
                </th>
                <th className="px-4 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Address
                </th>
                <th className="px-4 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Referred By
                </th>
                <th className="px-4 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Plan
                </th>
                <th className="px-4 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 text-center">
                  Users
                </th>
                <th className="px-4 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 text-center">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                      Loading stores...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <Store className="mx-auto h-8 w-8 mb-2 text-slate-600 opacity-50" />
                    No stores found
                  </td>
                </tr>
              ) : (
                filtered.map((store, idx) => (
                  <motion.tr
                    key={store.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="group transition-colors hover:bg-slate-900/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 ring-1 ring-amber-500/20">
                          <Store className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">{store.name}</p>
                          <p className="text-xs text-slate-500">{store.managerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-sm text-slate-300">{store.managerEmail}</p>
                      <p className="text-xs text-slate-500">{store.managerPhone}</p>
                    </td>
                    <td className="px-4 py-5 text-slate-400 max-w-[160px] truncate">
                      {store.address || "—"}
                    </td>
                    <td className="px-4 py-5 text-slate-400 italic">
                      {store.referredBy || "Direct"}
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 ring-1 ring-white/10 shadow-inner shadow-white/5">
                        {store.planName}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span className="text-lg font-bold text-amber-400">
                        {store.userCount}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          store.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                            : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${store.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {store.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-100">
                        <button
                          onClick={() => handleAction('view', store.id, store)}
                          className="group/btn relative flex items-center justify-center rounded-xl bg-blue-500/10 px-3 py-2 text-blue-400 ring-1 ring-blue-500/20 transition-all hover:bg-blue-500 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                          title="View Details"
                        >
                          <Eye size={16} />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/btn:opacity-100">View</span>
                        </button>
                        <button
                          onClick={() => handleAction('freeze', store.id)}
                          className="group/btn relative flex items-center justify-center rounded-xl bg-amber-500/10 px-3 py-2 text-amber-400 ring-1 ring-amber-500/20 transition-all hover:bg-amber-500 hover:text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                          title={store.status === 'ACTIVE' ? "Freeze Store" : "Unfreeze Store"}
                        >
                          <Lock size={16} />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/btn:opacity-100">{store.status === 'ACTIVE' ? "Freeze" : "Unfreeze"}</span>
                        </button>
                        <button
                          onClick={() => handleAction('delete', store.id)}
                          className="group/btn relative flex items-center justify-center rounded-xl bg-red-500/10 px-3 py-2 text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                          title="Delete Store"
                        >
                          <Trash2 size={16} />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/btn:opacity-100">Delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* View Modal */}
      <AnimatePresence>
        {viewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setViewModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-3xl rounded-[32px] border border-amber-500/20 bg-[#020717] shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-slate-900 to-slate-950 px-8 py-10 border-b border-amber-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_40%)]" />
                <button
                  onClick={() => setViewModal(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition backdrop-blur-md"
                >
                  <X size={20} />
                </button>
                <div className="relative z-10 flex items-start gap-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                    <Store className="h-10 w-10 text-white" />
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-white tracking-tight">
                        {viewModal.name}
                      </h2>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${viewModal.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'}`}>
                        {viewModal.status}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-amber-200/70 font-medium">
                      <MapPin size={14} />
                      {viewModal.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 grid gap-6 sm:grid-cols-2 bg-slate-950/80">
                {/* Manager Info */}
                <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 shadow-inner shadow-white/5">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    <Briefcase size={14} className="text-amber-500" /> Primary Contact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Manager Name</p>
                      <p className="text-base font-semibold text-white">{viewModal.managerName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Email Address</p>
                      <p className="text-sm font-medium text-amber-200/90">{viewModal.managerEmail}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Phone Number</p>
                      <p className="text-sm text-slate-300">{viewModal.managerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 shadow-inner shadow-white/5">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    <Calendar size={14} className="text-amber-500" /> Account Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Current Plan</p>
                      <p className="inline-flex items-center gap-1.5 mt-0.5 rounded-md bg-white/5 px-2.5 py-1 text-sm font-bold text-white ring-1 ring-white/10">
                        {viewModal.planName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Registered On</p>
                      <p className="text-sm text-slate-300">
                        {viewModal.createdAt ? new Date(viewModal.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Referred By</p>
                      <p className="text-sm italic text-slate-400">{viewModal.referredBy || "Direct"}</p>
                    </div>
                  </div>
                </div>

                {/* Advanced Analytics / Stats Preview */}
                <div className="sm:col-span-2 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/10 p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                    <Users size={14} /> Store Analytics Snapshot
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-slate-900/80 p-4 border border-white/5 backdrop-blur-md">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
                      <p className="text-2xl font-bold text-white">{viewModal.userCount}</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/80 p-4 border border-white/5 backdrop-blur-md">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Status</p>
                      <p className="text-xl font-bold text-emerald-400">{viewModal.status}</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/80 p-4 border border-white/5 backdrop-blur-md">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Platform ID</p>
                      <p className="text-xl font-mono text-slate-300">#{viewModal.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SAStores;
