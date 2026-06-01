import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const defaultForm = {
  supplier: "",
  status: "Pending",
  productId: "",
  quantity: "1",
  cost: "",
};

const PurchaseOrderCreateModal = ({ isOpen, products, onClose, onSave }) => {
  const [form, setForm] = useState(defaultForm);

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(form.productId)),
    [form.productId, products],
  );

  useEffect(() => {
    if (!selectedProduct) return;

    setForm((current) => ({
      ...current,
      cost:
        current.cost ||
        String(selectedProduct.costPrice ?? selectedProduct.price ?? ""),
    }));
  }, [selectedProduct]);

  useEffect(() => {
    if (!isOpen) {
      setForm(defaultForm);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!form.supplier.trim() || !form.productId || !selectedProduct) {
      return;
    }

    const quantity = Number(form.quantity);
    const cost = Number(form.cost);

    await onSave({
      supplier: form.supplier.trim(),
      status: form.status,
      items: [
        {
          productId: Number(form.productId),
          name: selectedProduct.name,
          cost,
          quantity,
        },
      ],
    });

    setForm(defaultForm);
    onClose();
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
          className="w-full max-w-2xl rounded-3xl bg-surface p-6 shadow-2xl dark:bg-surface-alt"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-main">Create Purchase Order</h3>
              <p className="text-sm text-text-muted">
                Add one incoming item to increase inventory stock.
              </p>
            </div>
            <Button variant="ghost" onClick={onClose} type="button">
              Close
            </Button>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={submitHandler}>
            <div>
              <label className="text-xs font-semibold text-text-muted">Supplier</label>
              <input
                name="supplier"
                className={inputStyles}
                value={form.supplier}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted">Status</label>
              <select
                name="status"
                className={inputStyles}
                value={form.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-text-muted">Product</label>
              <select
                name="productId"
                className={inputStyles}
                value={form.productId}
                onChange={handleChange}
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="1"
                className={inputStyles}
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted">Cost</label>
              <input
                name="cost"
                type="number"
                min="0"
                step="0.01"
                className={inputStyles}
                value={form.cost}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Purchase Order
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseOrderCreateModal;