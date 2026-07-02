import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} from "../../services/superAdmin";

const emptyPlan = {
  name: "",
  price: "",
  durationDays: "",
  durationLabel: "",
  status: "ACTIVE",
  discount: 0,
  features: "",
};

const SASubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);

  const fetchPlans = () => {
    setLoading(true);
    getAllPlans()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyPlan);
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      durationDays: plan.durationDays || "",
      durationLabel: plan.durationLabel || "",
      status: plan.status,
      discount: plan.discount || 0,
      features: plan.features || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: form.price === "" ? 0 : Number(form.price),
        durationDays: form.durationDays === "" ? null : Number(form.durationDays),
        discount: form.discount === "" ? 0 : Number(form.discount),
      };
      if (editingPlan) {
        await updatePlan(editingPlan.id, payload);
        toast.success("Subscription plan updated successfully");
      } else {
        await createPlan(payload);
        toast.success("Subscription plan created successfully");
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save plan");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deletePlan(id);
      toast.success("Subscription plan deleted successfully");
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete plan");
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await togglePlanStatus(id);
      toast.success("Plan status toggled successfully");
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to toggle status");
      console.error(err);
    }
  };

  const cardColors = [
    "border-blue-500/20 hover:border-blue-400/40",
    "border-emerald-500/20 hover:border-emerald-400/40",
    "border-purple-500/20 hover:border-purple-400/40",
    "border-amber-500/20 hover:border-amber-400/40",
    "border-pink-500/20 hover:border-pink-400/40",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-white/80" />
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Manage Subscription Plans
              </h1>
              <p className="mt-1 text-base text-white/70">
                Create, edit, and manage subscription tiers for store owners
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <Plus size={16} /> Create New Plan
          </button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-[28px] border border-amber-500/10 bg-slate-900/60"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-[28px] border ${cardColors[idx % cardColors.length]} bg-slate-950/90 p-7 shadow-2xl backdrop-blur-lg transition-all`}
            >
              {/* Discount badge */}
              {plan.discount > 0 && (
                <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs font-bold text-white shadow-lg">
                  {plan.discount}%
                </div>
              )}

              {/* Toggle status */}
              <button
                onClick={() => handleToggle(plan.id)}
                className="absolute top-5 right-5 text-slate-400 hover:text-amber-300 transition"
                title={plan.status === "ACTIVE" ? "Deactivate" : "Activate"}
              >
                {plan.status === "ACTIVE" ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>

              <div className="mt-4 flex items-baseline gap-1">
                <IndianRupee className="h-5 w-5 text-white" />
                <span className="text-4xl font-bold text-white">
                  {Number(plan.price).toLocaleString("en-IN")}
                </span>
                {plan.durationLabel && (
                  <span className="ml-1 text-sm text-slate-400">
                    /{plan.durationLabel}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    plan.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                      : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                  }`}
                >
                  Status: {plan.status}
                </span>
              </div>

              {/* Features */}
              {plan.features && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
                    Features
                  </p>
                  {plan.features.split(",").map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-300 mt-1"
                    >
                      <Check size={14} className="text-emerald-400" />
                      {f.trim()}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 ring-1 ring-amber-500/20 transition hover:bg-amber-500/20"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-[28px] border border-amber-500/20 bg-slate-950 p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingPlan ? "Edit Plan" : "Create New Plan"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Plan Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                    placeholder="e.g. Gold Plan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Price (₹)
                    </label>
                    <input
                      required
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                      placeholder="11999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={form.discount}
                      onChange={(e) =>
                        setForm({ ...form, discount: e.target.value })
                      }
                      className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={form.durationDays}
                      onChange={(e) =>
                        setForm({ ...form, durationDays: e.target.value })
                      }
                      className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                      placeholder="180"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Duration Label
                    </label>
                    <input
                      value={form.durationLabel}
                      onChange={(e) =>
                        setForm({ ...form, durationLabel: e.target.value })
                      }
                      className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                      placeholder="6 months"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Features (comma-separated)
                  </label>
                  <input
                    value={form.features}
                    onChange={(e) =>
                      setForm({ ...form, features: e.target.value })
                    }
                    className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                    placeholder="All Features, Priority Support"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3 text-sm text-white outline-none focus:border-amber-400/40"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] transition hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingPlan
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SASubscriptions;
