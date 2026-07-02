import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const AddProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "",
          sku: product.sku || "",
          hsn: product.hsn || "",
          cost: product.costPrice || "",
          price: product.price || "",
          stock: product.quantity || "",
          minStock: product.minStock || "5",
        });
      } else {
        reset({
          name: "",
          brand: "",
          category: "",
          sku: "",
          hsn: "",
          cost: "",
          price: "",
          stock: "",
          minStock: "5",
        });
      }
    }
  }, [isOpen, product, reset]);

  const submitHandler = async (values) => {
    await onSave(values);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center glass-overlay px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-2xl dark:bg-surface-alt"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-main">
                {product ? "Edit Product" : "Add New Product"}
              </h3>
              <p className="text-sm text-text-muted">
                {product ? "Update product details." : "Fill in the details to add a product to inventory."}
              </p>
            </div>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Product Name
                </label>
                <input
                  className={inputStyles}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    Product name is required.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Brand
                </label>
                <input
                  list="brands-list"
                  placeholder="Select or type a brand..."
                  className={inputStyles}
                  {...register("brand", { required: true })}
                />
                <datalist id="brands-list">
                  <option value="Apple" />
                  <option value="Samsung" />
                  <option value="Sony" />
                  <option value="LG" />
                  <option value="Dell" />
                  <option value="HP" />
                  <option value="Lenovo" />
                  <option value="Asus" />
                  <option value="Acer" />
                  <option value="Microsoft" />
                  <option value="Panasonic" />
                  <option value="Philips" />
                  <option value="Xiaomi" />
                  <option value="OnePlus" />
                  <option value="Bose" />
                  <option value="Motorola" />
                  <option value="Nokia" />
                  <option value="Google" />
                  <option value="Realme" />
                  <option value="Vivo" />
                  <option value="Oppo" />
                  <option value="TCL" />
                  <option value="Hisense" />
                  <option value="JBL" />
                  <option value="Sennheiser" />
                  <option value="Garmin" />
                  <option value="Fitbit" />
                  <option value="Dyson" />
                  <option value="Intel" />
                  <option value="AMD" />
                  <option value="Nvidia" />
                  <option value="Logitech" />
                  <option value="Corsair" />
                  <option value="Razer" />
                </datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Category
                </label>
                <input
                  list="categories-list"
                  placeholder="Select or type a category..."
                  className={inputStyles}
                  {...register("category", { required: true })}
                />
                <datalist id="categories-list">
                  <option value="Smartphone" />
                  <option value="Laptop" />
                  <option value="Tablet" />
                  <option value="Smartwatch" />
                  <option value="Television" />
                  <option value="Refrigerator" />
                  <option value="Washing Machine" />
                  <option value="Microwave Oven" />
                  <option value="Air Conditioner" />
                  <option value="Headphones" />
                  <option value="Earbuds" />
                  <option value="Bluetooth Speaker" />
                  <option value="Camera" />
                  <option value="Desktop PC" />
                  <option value="Monitor" />
                  <option value="Printer" />
                  <option value="Router" />
                  <option value="Power Bank" />
                  <option value="Gaming Console" />
                </datalist>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">SKU</label>
                <input
                  className={inputStyles}
                  {...register("sku", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  HSN Code
                </label>
                <input
                  className={inputStyles}
                  {...register("hsn", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Cost Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputStyles}
                  {...register("cost", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Selling Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputStyles}
                  {...register("price", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputStyles}
                  {...register("stock", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Min Stock Alert
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputStyles}
                  {...register("minStock", { required: true })}
                />
              </div>

              <div className="col-span-1 mt-2 flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {product ? "Save Changes" : "Save Product"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;
