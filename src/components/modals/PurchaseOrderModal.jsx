import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const PurchaseOrderModal = ({ isOpen, mode, order, onClose, onSave }) => {
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (order) {
      setSupplier(order.supplier || "");
      setStatus(order.status || "Pending");
    }
  }, [order]);

  if (!isOpen || !order) {
    return null;
  }

  const items = order.items || [];

  const handleSave = () => {
    onSave({ supplier: supplier.trim(), status });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center glass-overlay px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-3xl rounded-3xl bg-surface p-6 shadow-2xl dark:bg-surface-alt"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text-main">
                {mode === "edit" ? "Edit Purchase Order" : "Purchase Order Details"}
              </h3>
              <p className="text-sm text-text-muted">{order.id}</p>
            </div>
            <Button variant="ghost" onClick={onClose} type="button">
              Close
            </Button>
          </div>

          {mode === "edit" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-muted">Supplier</label>
                <input
                  className={inputStyles}
                  value={supplier}
                  onChange={(event) => setSupplier(event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">Status</label>
                <select
                  className={inputStyles}
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="flex items-end justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} type="button">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold text-text-muted">Supplier</p>
                  <p className="mt-1 text-sm text-text-main">{order.supplier}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted">Date</p>
                  <p className="mt-1 text-sm text-text-main">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted">Items</p>
                  <p className="mt-1 text-sm text-text-main">{order.itemsCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted">Status</p>
                  <p className="mt-1 text-sm text-text-main">{order.status}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-muted">Purchase Items</p>
                <div className="mt-2 overflow-hidden rounded-2xl border border-card-border">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-alt text-left text-xs text-text-muted dark:bg-surface">
                      <tr>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length ? (
                        items.map((item) => (
                          <tr key={item.id || `${item.name}-${item.quantity}`} className="border-t border-card-border">
                            <td className="px-4 py-3 text-text-main">{item.name}</td>
                            <td className="px-4 py-3 text-text-muted">{item.quantity}</td>
                            <td className="px-4 py-3 text-text-muted">{item.cost}</td>
                            <td className="px-4 py-3 text-text-main">{item.subtotal}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-6 text-center text-text-muted" colSpan="4">
                            No purchase items available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button variant="ghost" onClick={onClose} type="button">
                  Close
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseOrderModal;