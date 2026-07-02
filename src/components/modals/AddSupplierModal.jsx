import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";

const AddSupplierModal = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: supplier?.name || "",
        email: supplier?.email || "",
        contact: supplier?.contact || "",
      });
    }
  }, [isOpen, supplier]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-amber-500/20 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.1)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-amber-500/10">
          <h2 className="text-xl font-bold text-white">
            {supplier ? "Edit Supplier" : "New Supplier"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Supplier Name *
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="e.g. Acme Electronics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="e.g. contact@acme.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Contact Number *
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="e.g. +91 98765 43210"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              {supplier ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
